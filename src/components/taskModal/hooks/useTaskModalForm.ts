import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card as CardType } from '@/lib/types';
import { cardSchema, CardFormData } from '../types/TaskModal.form.types';
import { CardJSON } from '@/lib/cardJsonUtils';

interface UseCardFormProps {
  card?: CardType | null;
  cardJSON?: CardJSON | null;
}

export const useTaskModalForm = ({ card, cardJSON }: UseCardFormProps) => {
  // Get default values from card or JSON data
  const getDefaultValues = (): CardFormData => {
    if (cardJSON) {
      return {
        title: cardJSON.title || '',
        description: cardJSON.description || '',
        startDate: cardJSON.startDate ? new Date(cardJSON.startDate).toISOString().split('T')[0] : '',
        dueDate: cardJSON.dueDate ? new Date(cardJSON.dueDate).toISOString().split('T')[0] : '',
        priority: undefined,
      };
    }

    return {
      title: card?.title || '',
      description: card?.description || '',
      startDate: card?.startDate ? card.startDate.toISOString().split('T')[0] : '',
      dueDate: card?.dueDate ? card.dueDate.toISOString().split('T')[0] : '',
      priority: card?.priority || undefined,
    };
  };

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: getDefaultValues(),
  });

  // Reset form when card or JSON data changes
  useEffect(() => {
    const values = getDefaultValues();
    form.reset(values);
  }, [card, cardJSON, form.reset]);

  return form;
};
