'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LockKeyhole } from 'lucide-react';

type EditableFieldBase = {
  label: string;
};

type TextFieldProps = EditableFieldBase & {
  type: 'text';
  value: string;
  onSave: (value: string) => void;
  inputType?: 'text' | 'email' | 'tel';
  placeholder?: string;
};

type SelectFieldProps = EditableFieldBase & {
  type: 'select';
  value: string;
  onSave: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
};

type ReadonlyFieldProps = EditableFieldBase & {
  type: 'readonly';
  value: string;
  tooltip?: string;
};

type EditableFieldProps = TextFieldProps | SelectFieldProps | ReadonlyFieldProps;

function TextValue({
  value,
  onSave,
  inputType = 'text',
  placeholder,
}: Omit<TextFieldProps, 'label' | 'type'>) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const save = useCallback(() => {
    setIsEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) {
      onSave(trimmed);
    }
  }, [draft, value, onSave]);

  const discard = useCallback(() => {
    setDraft(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      discard();
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={inputType}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-7 text-sm"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="text-sm text-left rounded px-2 py-1 -mx-2 -my-1 hover:bg-muted transition-colors cursor-text truncate"
    >
      {value || <span className="text-muted-foreground">{placeholder || 'Not set'}</span>}
    </button>
  );
}

function SelectValue_({
  value,
  onSave,
  options,
  placeholder,
}: Omit<SelectFieldProps, 'label' | 'type'>) {
  const displayLabel = options.find((o) => o.value === value)?.label;

  return (
    <Select value={value} onValueChange={onSave}>
      <SelectTrigger className="h-7 text-sm border-none shadow-none px-2 -mx-2 hover:bg-muted transition-colors focus:ring-0">
        <SelectValue placeholder={placeholder || 'Not set'}>
          {displayLabel || <span className="text-muted-foreground">{placeholder || 'Not set'}</span>}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ReadonlyValue({ value, tooltip }: { value: string; tooltip?: string }) {
  const content = (
    <span className="text-sm truncate inline-flex items-center gap-1.5">
      {value || 'N/A'}
      {tooltip && <LockKeyhole className="h-3 w-3 text-muted-foreground shrink-0" />}
    </span>
  );

  if (!tooltip) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function EditableField(props: EditableFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0 w-32">
        {props.label}
      </span>
      <div className="flex-1 min-w-0 flex justify-start">
        {props.type === 'text' && (
          <TextValue
            value={props.value}
            onSave={props.onSave}
            inputType={props.inputType}
            placeholder={props.placeholder}
          />
        )}
        {props.type === 'select' && (
          <SelectValue_
            value={props.value}
            onSave={props.onSave}
            options={props.options}
            placeholder={props.placeholder}
          />
        )}
        {props.type === 'readonly' && <ReadonlyValue value={props.value} tooltip={props.tooltip} />}
      </div>
    </div>
  );
}
