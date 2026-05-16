import autocannon from 'autocannon'
import mongoose from 'mongoose'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

const CONCURRENCY = 50
const DURATION = 15
const GPU_COUNT = 500
const EXTERNAL_URL = process.env.BASE_URL
let server, mongoServer, baseUrl

function load(opts) {
  return new Promise((resolve, reject) => {
    const instance = autocannon({ url: baseUrl, connections: CONCURRENCY, duration: DURATION, ...opts })
    instance.on('done', resolve)
    instance.on('error', reject)
    setTimeout(() => reject(new Error('Load test timed out')), (DURATION + 30) * 1000)
  })
}

async function run() {
  const jsonHeader = { 'content-type': 'application/json' }

  if (EXTERNAL_URL) {
    baseUrl = EXTERNAL_URL
    console.log(`Using external server at ${baseUrl}`)
  } else {
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } })
    process.env.MONGO_URI = mongoServer.getUri()
    process.env.JWT_SECRET = 'loadtest-secret'
    process.env.NODE_ENV = 'test'
    process.env.LOAD_TEST = 'true'
    process.env.FRONTEND_URL = 'http://localhost:5173'

    const { default: connectDB } = await import('../server/config/db.js')
    await connectDB()
    const { app } = await import('../server/server.js')

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`
        console.log(`Server on ${baseUrl}`)
        resolve()
      })
    })

    const { default: Gpu } = await import('../server/models/Gpu.js')
    const { default: User } = await import('../server/models/User.js')

    const docs = []
    const names = ['RTX 4090', 'H100', 'A100', 'RTX 5090', 'B200', 'L40S']
    for (let i = 0; i < GPU_COUNT; i++) {
      const idx = i % names.length
      docs.push({
        name: `${names[idx]} #${i}`, arch: ['Blackwell', 'Hopper', 'Ampere'][idx % 3],
        vram: `${[24, 80, 48][idx % 3]}GB VRAM`, vramGB: [24, 80, 48][idx % 3],
        price: [0.33, 3.49, 2.50][idx % 3], rangeLow: 0.1, rangeHigh: 7.0,
        availability: ['High', 'Med', 'Low'][i % 3], region: 'nepal',
        inStock: Math.floor(Math.random() * 50), description: `Load test GPU ${i}`,
        sparkData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50)),
      })
    }
    await Gpu.insertMany(docs)
    console.log(`Seeded ${docs.length} GPUs`)

    await User.create({ name: 'Load Test', email: 'load@test.com', password: 'password123', balance: 99999 })
  }

  // Get GPU ID via API (works in both modes)
  const gpuListRes = await fetch(`${baseUrl}/api/gpus?limit=1`)
  const gpuList = await gpuListRes.json()
  const gpuDocs = Array.isArray(gpuList) ? gpuList : (gpuList.data || gpuList.gpus || [])
  const gpuId = gpuDocs.length > 0 ? gpuDocs[0]._id : '000000000000000000000000'

  console.log(`\n--- ${CONCURRENCY} connections, ${DURATION}s each ---\n`)

  console.log(`\n--- ${CONCURRENCY} connections, ${DURATION}s each ---\n`)

  const results = []

  for (const { name, path } of [
    { name: 'Health Check', path: '/api/health' },
    { name: 'GPU List', path: '/api/gpus' },
    { name: 'GPU Detail', path: `/api/gpus/${gpuId}` },
    { name: 'GPU Filtered', path: '/api/gpus?availability=High&sort=price_asc' },
    { name: 'GPU $regex Search', path: '/api/gpus?search=4090' },
  ]) {
    process.stdout.write(`  ${name}... `)
    const r = await load({ requests: [{ method: 'GET', path, headers: jsonHeader }] })
    const f = format(name, r)
    results.push(f)
    console.log(`${String(f.reqs).padStart(6)} req | avg ${f.avg}ms | p50 ${f.p50}ms | p95 ${f.p95}ms | p99 ${f.p99}ms | err ${f.err}`)
  }

  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: jsonHeader,
    body: JSON.stringify({ email: 'load@test.com', password: 'password123' }),
  })
  const loginBody = await loginRes.json()
  const token = loginBody.token
  const authHeader = { authorization: `Bearer ${token}`, 'content-type': 'application/json' }

  process.stdout.write(`  Profile (auth'd)... `)
  const profileR = await load({ requests: [{ method: 'GET', path: '/api/auth/me', headers: authHeader }] })
  results.push(format('Get Profile', profileR))
  const pf = results[results.length - 1]
  console.log(`${String(pf.reqs).padStart(6)} req | avg ${pf.avg}ms | p50 ${pf.p50}ms | p95 ${pf.p95}ms | p99 ${pf.p99}ms | err ${pf.err}`)

  process.stdout.write(`  Topup (POST/auth'd)... `)
  const topupR = await load({
    requests: [{ method: 'POST', path: '/api/auth/topup', headers: authHeader, body: JSON.stringify({ amount: 10 }) }],
  })
  results.push(format('Topup', topupR))
  const tf = results[results.length - 1]
  console.log(`${String(tf.reqs).padStart(6)} req | avg ${tf.avg}ms | p50 ${tf.p50}ms | p95 ${tf.p95}ms | p99 ${tf.p99}ms | err ${tf.err}`)

  console.log('\n' + '='.repeat(100))
  console.log('                    LOAD TEST RESULTS' + (EXTERNAL_URL ? ' (CLUSTER MODE)' : ' (SINGLE PROCESS)'))
  console.log(`   500 GPUs | ${CONCURRENCY} connections | ${DURATION}s each endpoint`)
  console.log('='.repeat(100))
  console.log(`  ${'Endpoint'.padEnd(22)} ${'Reqs'.padStart(8)} ${'Avg'.padStart(8)} ${'P50'.padStart(8)} ${'P95'.padStart(8)} ${'P99'.padStart(8)}  Errors`)
  console.log('  ' + '-'.repeat(80))
  for (const r of results) {
    console.log(`  ${r.name.padEnd(22)} ${r.reqs.toString().padStart(8)} ${r.avg.padStart(7)}ms ${r.p50.padStart(7)}ms ${r.p95.padStart(7)}ms ${r.p99.padStart(7)}ms  ${r.err}`)
  }
  console.log('='.repeat(100))

  if (server) await new Promise(r => server.close(r))
  process.exit(0)
}

function format(name, r) {
  const lat = r.latency || {}
  return {
    name, reqs: (r.requests || {}).total || 0,
    avg: (lat.average || 0).toFixed(1), p50: (lat.p50 || 0).toFixed(1),
    p95: (lat.p95 || 0).toFixed(1), p99: (lat.p99 || 0).toFixed(1),
    err: (r.errors || 0) + (r.timeouts || 0),
  }
}

run().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
