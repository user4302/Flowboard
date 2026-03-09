'use client';

import { TaskModalForm } from './TaskModalForm';
import { Card } from '@/lib/types';

interface TaskModalFormSectionProps {
  card: Card | null;
  form: unknown;
  errors: Record<string, unknown>;
  register: unknown;
  onToggleCompleted?: () => void;
}

export function TaskModalFormSection({
  card,
  form,
  errors,
  register,
  onToggleCompleted
}: TaskModalFormSectionProps) {
  return (
    <TaskModalForm
      card={card}
      form={form}
      errors={errors}
      register={register}
      onToggleCompleted={onToggleCompleted}
    />
  );
}
