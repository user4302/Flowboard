import { cn } from '@/lib/utils';
import { Label } from '@/lib/types';
import { getContrastColor } from '@/lib/colorUtils';
import { CardLabelsProps } from '../types';

export function TaskCardCardLabels({ labelIds, labels, onLabelClick }: CardLabelsProps) {
  if (!labelIds?.length) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-1">
      {labelIds.map((labelId) => {
        const label = labels.find((l: Label) => l.id === labelId);
        if (!label) return null;

        return (
          <div
            key={label.id}
            className="h-1.5 w-10 rounded-full"
            style={{
              backgroundColor: label.color,
              color: getContrastColor(label.color)
            }}
            title={label.text}
            onClick={() => onLabelClick?.(labelId)}
          />
        );
      })}
    </div>
  );
}
