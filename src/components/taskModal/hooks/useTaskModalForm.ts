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
        startDate: cardJSON.startDate ? new Date(cardJSON.startDate).toISOString() : '',
        dueDate: cardJSON.dueDate ? new Date(cardJSON.dueDate).toISOString() : '',
        priority: null,
      };
    }

    return {
      title: card?.title || '',
      description: card?.description || '',
      startDate: card?.startDate ? new Date(card.startDate).toISOString() : '',
      dueDate: card?.dueDate ? new Date(card.dueDate).toISOString() : '',
      priority: card?.priority !== undefined ? card.priority : null,
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