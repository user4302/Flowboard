import { z } from 'zod';

export const boardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100, 'Board name too long'),
});

export const listSchema = z.object({
  title: z.string().min(1, 'List title is required').max(100, 'List title too long'),
  color: z.string().optional(),
});

export const cardSchema = z.object({
  title: z.string().min(1, 'Card title is required').max(200, 'Card title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  listId: z.string().min(1, 'List is required'),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
});

export const labelSchema = z.object({
  text: z.string().min(1, 'Label text is required').max(50, 'Label text too long'),
  color: z.string().min(1, 'Color is required'),
});

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email').optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
});

export const checklistItemSchema = z.object({
  text: z.string().min(1, 'Item text is required').max(200, 'Item text too long'),
  done: z.boolean(),
});

export type BoardInput = z.infer<typeof boardSchema>;
export type ListInput = z.infer<typeof listSchema>;
export type CardInput = z.infer<typeof cardSchema>;
export type LabelInput = z.infer<typeof labelSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type ChecklistItemInput = z.infer<typeof checklistItemSchema>;
