import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card as CardType } from '@/lib/types';
import { cardSchema, CardFormData } from '../types/TaskModal.form.types';

interface UseCardFormProps {
  card: CardType | null | undefined;
}

export const useTaskModalCardForm = ({ card }: UseCardFormProps) => {
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: card?.title || '',
      description: card?.description || '',
      startDate: card?.startDate ? card.startDate.toISOString().split('T')[0] : '',
      dueDate: card?.dueDate ? card.dueDate.toISOString().split('T')[0] : '',
      priority: card?.priority || undefined,
    },
  });

  // Reset form when card changes
  useEffect(() => {
    if (card) {
      form.reset({
        title: card.title,
        description: card.description || '',
        startDate: card.startDate ? card.startDate.toISOString().split('T')[0] : '',
        dueDate: card.dueDate ? card.dueDate.toISOString().split('T')[0] : '',
        priority: card.priority || undefined,
      });
    }
  }, [card, form.reset]);

  return form;
};
