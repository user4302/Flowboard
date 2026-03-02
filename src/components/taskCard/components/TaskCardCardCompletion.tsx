import { cn } from '@/lib/utils';
import { CardCompletionProps } from '../types';

export function TaskCardCardCompletion({ completed, onToggle, size = 'small' }: CardCompletionProps) {
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-6 w-6',
    large: 'h-7 w-7'
  };

  const iconSizes = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4',
    large: 'h-5 w-5'
  };

  const baseClasses = {
    small: '',
    medium: '',
    large: ''
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
        sizeClasses[size],
        baseClasses[size],
        completed
          ? 'bg-indigo-600 border-indigo-600'
          : 'border-slate-300 hover:border-indigo-400 dark:border-slate-600'
      )}
    >
      {completed && (
        <svg className={cn("text-white", iconSizes[size])} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
