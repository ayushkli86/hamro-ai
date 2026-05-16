export function renderInvoice(order) {
  const total = order.cost
  const tax = total * 0.13
  const grandTotal = total + tax
  const rate = order.hours > 0 ? order.cost / order.hours : 0

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Invoice — hamro.ai</title>
<style>
  body { font-family: 'Courier New', monospace; max-width: 600px; margin: 40px auto; padding: 20px; color: #333; }
  .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 20px; margin-bottom: 20px; }
  .header h1 { margin: 0; font-size: 24px; }
  .header p { margin: 4px 0; color: #666; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
  .total { font-size: 18px; font-weight: bold; margin-top: 16px; padding-top: 16px; border-top: 2px solid #333; }
  .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
  @media print { body { margin: 0; } .no-print { display: none; } }
</style></head>
<body>
  <div class="header">
    <h1>hamro.ai</h1>
    <p>GPU Cloud • Nepal</p>
    <p>Invoice #${order._id.toString().slice(-8).toUpperCase()}</p>
  </div>
  <p><strong>Customer:</strong> ${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})</p>
  <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  <p><strong>Region:</strong> ${order.region}</p>
  <br>
  <div class="row"><span>${order.gpuName} x ${order.hours}h @ $${rate.toFixed(2)}/hr</span><span>$${total.toFixed(2)}</span></div>
  <div class="row"><span>Status</span><span>${order.status.toUpperCase()}</span></div>
  <div class="row"><span>Tax (13%)</span><span>$${tax.toFixed(2)}</span></div>
  <div class="row total"><span>Grand Total</span><span>$${grandTotal.toFixed(2)}</span></div>
  <div class="footer"><p>Thank you for using hamro.ai</p><button class="no-print" onclick="window.print()" style="margin-top:12px;padding:8px 20px;cursor:pointer;">Print / Save PDF</button></div>
</body></html>`
}
