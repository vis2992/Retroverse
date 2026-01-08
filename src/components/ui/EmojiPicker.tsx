'use client';

import { Input } from './Input';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export function EmojiPicker({ value, onChange, label }: EmojiPickerProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          {label}
        </label>
      )}
      
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 text-center text-2xl"
        maxLength={2}
        placeholder="😊"
      />
    </div>
  );
}

