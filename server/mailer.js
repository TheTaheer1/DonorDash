import nodemailer from 'nodemailer';

const transport = process.env.SMTP_HOST ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }) : null;
export async function notifyDonor(donor, request) {
  if (!transport) { console.info(`[DonorDash] notification queued for ${donor.user?.email || donor.user}: ${request.bloodGroup} at ${request.hospital}`); return; }
  try { await transport.sendMail({ from: process.env.SMTP_USER, to: donor.user.email, subject: `Urgent ${request.bloodGroup} blood request near you`, text: `A compatible request is open at ${request.hospital}, ${request.city}. Log in to DonorDash to respond.` }); } catch (error) { console.error('[DonorDash] email failed; request remains active', error.message); }
}
