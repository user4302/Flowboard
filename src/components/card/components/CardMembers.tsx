import { User as UserType } from '@/lib/types';
import { CardMembersProps } from '../types/card.types';

export function CardMembers({ members, maxVisible = 3 }: CardMembersProps) {
  if (members.length === 0) return null;

  return (
    <div className="flex -space-x-1">
      {members.slice(0, maxVisible).map((member, index) => (
        <div
          key={member.id}
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-xs font-medium text-white dark:border-slate-900"
          style={{ zIndex: maxVisible - index }}
          title={member.name}
        >
          {member.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()}
        </div>
      ))}
      {members.length > maxVisible && (
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xs font-medium text-slate-600 dark:border-slate-900 dark:bg-slate-600 dark:text-slate-300"
          style={{ zIndex: 0 }}
        >
          +{members.length - maxVisible}
        </div>
      )}
    </div>
  );
}
