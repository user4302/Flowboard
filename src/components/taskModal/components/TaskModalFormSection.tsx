'use client';

import { TaskModalForm } from './TaskModalForm';

interface TaskModalFormSectionProps {
  card: any;
  form: any;
  errors: any;
  register: any;
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
