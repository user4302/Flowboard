/**
 * Important information alert for JoinBoardModal
 */

import { AlertCircle } from 'lucide-react';

export function JoinAlert() {
  return (
    <div className="mb-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <p className="font-medium">Important:</p>
          <ul className="mt-1 list-disc list-inside space-y-1 text-xs">
            <li>Board owner must approve your request</li>
            <li>Save your credentials for this board</li>
            <li>You&apos;ll need these credentials to access this board</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
