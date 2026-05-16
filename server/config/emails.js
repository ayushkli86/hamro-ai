export function welcomeEmail(name, verifyUrl) {
  return {
    subject: 'Welcome to hamro.ai!',
    html: `<div style="max-width:480px;margin:0 auto;font-family:sans-serif">
      <h2 style="color:#00d0a2">Welcome ${name}!</h2>
      <p style="color:#ccc">Your hamro.ai account is ready. You have <strong>$5</strong> credit to start renting GPUs in Nepal.</p>
      <p style="color:#ccc">Please verify your email:</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#00d0a2;color:#000;text-decoration:none;border-radius:6px;font-weight:bold">Verify Email</a>
      <p style="color:#888;margin-top:20px;font-size:12px">hamro.ai — GPU Cloud Nepal</p>
    </div>`,
  }
}

export function orderConfirmationEmail(name, gpuName, hours, cost, dashboardUrl) {
  return {
    subject: `Order Confirmed — ${gpuName}`,
    html: `<div style="max-width:480px;margin:0 auto;font-family:sans-serif">
      <h2 style="color:#00d0a2">Order Confirmed</h2>
      <p style="color:#ccc">Hi ${name},</p>
      <p style="color:#ccc">You rented <strong>${gpuName}</strong> for <strong>${hours} hour(s)</strong> at <strong>$${cost.toFixed(2)}</strong>.</p>
      <p style="color:#ccc">Region: Nepal</p>
      <a href="${dashboardUrl}" style="display:inline-block;padding:10px 20px;background:#00d0a2;color:#000;text-decoration:none;border-radius:6px;font-weight:bold">View in Dashboard</a>
      <p style="color:#888;margin-top:20px;font-size:12px">hamro.ai — GPU Cloud Nepal</p>
    </div>`,
  }
}

export function passwordResetEmail(resetUrl) {
  return {
    subject: 'Password Reset — hamro.ai',
    html: `<div style="max-width:480px;margin:0 auto;font-family:sans-serif">
      <h2 style="color:#00d0a2">Password Reset</h2>
      <p style="color:#ccc">Click below to reset your password. Link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#00d0a2;color:#000;text-decoration:none;border-radius:6px;font-weight:bold">Reset Password</a>
      <p style="color:#888;margin-top:20px;font-size:12px">hamro.ai — GPU Cloud Nepal</p>
    </div>`,
  }
}
