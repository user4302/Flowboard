/**
 * Information section for InviteModal
 */

import { Users, Clock, Share2 } from 'lucide-react';

export function InviteInfo() {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Users className="h-4 w-4" />
        <span>Only users you approve can join</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Clock className="h-4 w-4" />
        <span>Link expires after selected time</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Share2 className="h-4 w-4" />
        <span>Share the link with team members</span>
      </div>
    </div>
  );
}
