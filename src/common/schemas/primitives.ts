import { z } from 'zod';

// --- Identity and Credentials ---

export const emailSchema = z.email('Please enter a valid email');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(200, 'Password must not exceed 200 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z.string().min(2).max(300, 'Name must not exceed 200 characters');

// --- Financial Primitives ---

export const currencySchema = z
  .string()
  .length(3, 'Currency must be 3-letter ISO code')
  .toUpperCase();

export const moneyAmountSchema = z
  .number({ error: 'Amount must be a number' })
  .positive('Amount must be greater than zero')
  .max(1_000_000_000, 'Amount exceeds maximum allowable limit');

// --- Identifiers & Query Primitives ---

export const uuidSchema = z.uuid('Invalid identifier format');
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
