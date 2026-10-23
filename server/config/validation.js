import { z } from 'zod';

export const group = z.enum(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']);
export const profileSchema = z.object({ bloodGroup: group, gender: z.enum(['Male', 'Female', 'Other']), dob: z.coerce.date(), city: z.string().trim().min(2).max(100), lastDonatedAt: z.coerce.date().optional().nullable(), isAvailable: z.boolean().default(true) }).superRefine((data, ctx) => {
  const today = new Date();
  if (data.dob > today) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dob'], message: 'Date of birth cannot be in the future' });
  const years = today.getFullYear() - data.dob.getFullYear() - ((today.getMonth() < data.dob.getMonth() || (today.getMonth() === data.dob.getMonth() && today.getDate() < data.dob.getDate())) ? 1 : 0);
  if (years < 18 || years > 65) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dob'], message: 'Donors must be between 18 and 65 years old' });
  if (data.lastDonatedAt && data.lastDonatedAt > today) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['lastDonatedAt'], message: 'Last donation date cannot be in the future' });
});
export const requestSchema = z.object({ bloodGroup: group, unitsNeeded: z.coerce.number().int().min(1).max(10), hospital: z.string().trim().min(2).max(160), city: z.string().trim().min(2).max(100), deadline: z.coerce.date() });
export const registrationSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().email().max(254), password: z.string().min(8).max(128), phone: z.string().trim().min(8).max(30), bloodGroup: group, gender: z.enum(['Male', 'Female', 'Other']), dob: z.coerce.date(), city: z.string().trim().min(2).max(100), lastDonatedAt: z.coerce.date().optional().nullable(), isAvailable: z.boolean().default(true) }).superRefine((data, ctx) => { const today = new Date(); if (data.dob > today) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dob'], message: 'Date of birth cannot be in the future' }); const years = today.getFullYear() - data.dob.getFullYear() - ((today.getMonth() < data.dob.getMonth() || (today.getMonth() === data.dob.getMonth() && today.getDate() < data.dob.getDate())) ? 1 : 0); if (years < 18 || years > 65) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dob'], message: 'Donors must be between 18 and 65 years old' }); });
export const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().max(128) });
export const identitySchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().email().max(254), phone: z.string().trim().min(8).max(30) });
export const responseSchema = z.object({ status: z.enum(['ACCEPTED', 'DECLINED']) });
