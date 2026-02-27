'use client';

import { ModalForm } from '@/components/card/components/ModalForm';

interface ModalFormSectionProps {
  card: any;
  form: any;
  errors: any;
  register: any;
  onToggleCompleted: () => void;
}

export function ModalFormSection({
  card,
  form,
  errors,
  register,
  onToggleCompleted
}: ModalFormSectionProps) {
  return (
    <ModalForm
      card={card}
      form={form}
      errors={errors}
      register={register}
      onToggleCompleted={onToggleCompleted}
    />
  );
}
