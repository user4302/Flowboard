import { z } from 'zod';
import { Card as CardType } from '@/lib/types';

/**
 * Zod schema for card form validation
 * Defines the structure and validation rules for card data
 */
export const cardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.number().min(0, 'Priority must be between 0-100').max(100, 'Priority must be between 0-100').nullable().optional(),
});

/**
 * Type inference from the card schema
 * Provides TypeScript types for form data
 */
export type CardFormData = z.infer<typeof cardSchema>;

export type LabelManagerView = 'list' | 'create' | 'edit';

export interface LabelManagerProps {
  boardId: string;
  cardId: string;
  selectedLabelIds: string[];
  onClose: () => void;
}

export interface ModalFormProps {
  card?: CardType | null;
  form: any; // react-hook-form return type
  errors: any;
  register: any;
  onToggleCompleted?: () => void;
}
