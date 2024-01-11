import { useState } from 'react';
import { Plus } from './Icons';

interface Props {
  onAddTask: (name: string | undefined) => void;
}

export default function TaskCreator({ onAddTask }: Props) {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className="flex h-16 shrink-0 items-center justify-between px-4">
      <input
        className="bg-transparent outline-none"
        placeholder="Enter task name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (inputValue.trim() === '') {
            return;
          }

          if (e.key === 'Enter') {
            onAddTask(inputValue.trim());
            setInputValue('');
          }
        }}
      />
      <button
        type="button"
        onClick={() => {
          if (inputValue.trim() === '') {
            return;
          }
          onAddTask(inputValue.trim());
          setInputValue('');
        }}
        className={`transition ${
          inputValue.trim() !== ''
            ? 'cursor-pointer fill-primary'
            : 'cursor-auto fill-secondary'
        }`}
      >
        <Plus />
      </button>
    </div>
  );
}
