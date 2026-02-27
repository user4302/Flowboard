'use client';

import { TaskModalModalForm } from './TaskModalModalForm';

interface TaskModalModalFormSectionProps {
  card: any;
  form: any;
  errors: any;
  register: any;
  onToggleCompleted: () => void;
}

export function TaskModalModalFormSection({
  card,
  form,
  errors,
  register,
  onToggleCompleted
}: TaskModalModalFormSectionProps) {
  return (
    <TaskModalModalForm
      card={card}
      form={form}
      errors={errors}
      register={register}
      onToggleCompleted={onToggleCompleted}
    />
  );
}
