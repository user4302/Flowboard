/**
 * Registration form component for JoinBoardModal
 */

import { User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui';
import { JoinFormData } from '../../types';

interface JoinFormProps {
  formData: JoinFormData;
  isLoading: boolean;
  onUpdateField: (field: keyof JoinFormData, value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export function JoinForm({
  formData,
  isLoading,
  onUpdateField,
  onKeyPress
}: JoinFormProps) {
  return (
    <div className="mb-4 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onUpdateField('email', e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="your@email.com"
            disabled={isLoading}
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onUpdateField('username', e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Choose a username"
            disabled={isLoading}
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => onUpdateField('password', e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Create a password"
            disabled={isLoading}
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </div>
      </div>
    </div>
  );
}
