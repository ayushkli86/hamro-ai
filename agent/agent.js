#!/usr/bin/env node
import { execSync } from 'child_process'
import { homedir, hostname } from 'os'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, resolve } from 'path'
import os from 'os'

const CONFIG_PATH = join(homedir(), '.hamro-agent.json')
const API_BASE = process.env.HAMRO_API || 'http://localhost:5000/api'
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '5000', 10)

function loadConfig() {
  if (existsSync(CONFIG_PATH)) {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'))
  }
  return {}
}

function saveConfig(config) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}

function getGpuInfo() {
  try {
    const out = execSync('nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits 2>/dev/null', { timeout: 5000 })
    const [name, mem] = out.toString().trim().split(', ')
    return { gpuName: name.trim(), gpuMemory: parseFloat(mem) || 0 }
  } catch {
    return { gpuName: 'Unknown GPU', gpuMemory: 0 }
  }
}

function getSystemInfo() {
  return {
    totalMemory: Math.round(os.totalmem() / (1024 ** 3)),
    cpuCores: os.cpus().length,
    diskSpace: 0,
  }
}

async function api(path, options = {}) {
  const config = loadConfig()
  const headers = { 'Content-Type': 'application/json' }
  if (config.token) headers.Authorization = `Bearer ${config.token}`
  const res = await fetch(`${API_BASE}${path}`, { headers, ...options })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API ${res.status}: ${err}`)
  }
  return res.json()
}

async function register() {
  const gpu = getGpuInfo()
  const sys = getSystemInfo()
  const config = loadConfig()
  const data = { ...gpu, ...sys, pricePerHour: parseFloat(process.env.PRICE_PER_HOUR || '0.10') }
  if (process.env.REGION) data.region = process.env.REGION
  const res = await api('/agent/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  config.gpuId = res.gpuId
  saveConfig(config)
  console.log(`[hamro-agent] Registered GPU: ${gpu.gpuName} (${gpu.gpuMemory}GB VRAM)`)
}

async function heartbeat() {
  const config = loadConfig()
  if (!config.gpuId) return
  await api('/agent/heartbeat', {
    method: 'POST',
    body: JSON.stringify({ gpuId: config.gpuId }),
  }).catch(() => {})
}

async function pollJobs() {
  try {
    const { job } = await api('/agent/jobs')
    if (!job) return
    console.log(`[hamro-agent] Assigned job: ${job._id} — ${job.gpuName} — ${job.hoursRequested}h — $${job.cost}`)
    await updateJob(job._id, 'running')
    const result = await executeJob(job)
    if (result.success) {
      await updateJob(job._id, 'completed', result.output)
      console.log(`[hamro-agent] Job ${job._id} completed — earned $${job.cost}`)
    } else {
      await updateJob(job._id, 'failed', null, result.error)
      console.error(`[hamro-agent] Job ${job._id} failed: ${result.error}`)
    }
  } catch (err) {
    if (!err.message.includes('No available')) {
      console.error(`[hamro-agent] Poll error: ${err.message}`)
    }
  }
}

async function executeJob(job) {
  const workDir = join(homedir(), '.hamro-jobs', job._id.toString())
  mkdirSync(workDir, { recursive: true })
  const scriptPath = join(workDir, 'script.sh')
  writeFileSync(scriptPath, job.script)
  const cmd = [
    'docker run --rm --gpus all',
    `--memory="${Math.max(job.hoursRequested > 1 ? 8 : 4, os.totalmem() / (1024 ** 3) * 0.5)}g"`,
    `--cpus="${Math.max(1, os.cpus().length - 1)}"`,
    `-v "${scriptPath}:/workspace/script:ro"`,
    `-w /workspace`,
    `--name "hamro-job-${job._id}"`,
    job.dockerImage || 'python:3.11-slim',
    'sh /workspace/script',
  ].join(' ')
  try {
    const output = execSync(cmd, { timeout: Math.max(60000, job.hoursRequested * 3600000), cwd: workDir })
    return { success: true, output: output.toString().slice(0, 100000) }
  } catch (err) {
    return { success: false, error: (err.stderr || err.message || '').toString().slice(0, 100000) }
  }
}

async function updateJob(jobId, status, result, errorLog) {
  const body = { status }
  if (result) body.result = result
  if (errorLog) body.errorLog = errorLog
  return api(`/agent/jobs/${jobId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

async function setupToken() {
  const config = loadConfig()
  if (config.token) return
  const email = process.env.HAMRO_EMAIL
  const password = process.env.HAMRO_PASSWORD
  if (!email || !password) {
    console.error('Set HAMRO_EMAIL and HAMRO_PASSWORD env vars, or configure ~/.hamro-agent.json manually')
    process.exit(1)
  }
  const { token } = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  config.token = token
  saveConfig(config)
  console.log('[hamro-agent] Authenticated')
}

async function main() {
  console.log('[hamro-agent] Starting...')
  await setupToken()
  await register()
  console.log('[hamro-agent] Polling for jobs...')
  setInterval(heartbeat, 30000)
  setInterval(pollJobs, POLL_INTERVAL)
}

main().catch(err => { console.error(err); process.exit(1) })
