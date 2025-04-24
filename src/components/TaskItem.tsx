import React, { useEffect, useState } from 'react';
import { Play, CheckCircle, Trash2 } from 'lucide-react';

type TaskItemProps = {
  id: number;
  title: string;
  time: number;
  completed: boolean;
  onDelete: (id: number) => void;
  onStart: (id: number) => void;
  onComplete: (id: number) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ id, title, time, completed, onDelete, onStart, onComplete }) => {
  const [remainingTime, setRemainingTime] = useState(time * 60);
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const hours = Math.floor(minutes / 60);
    return `${hours > 0 ? `${String(hours).padStart(2, '0')}h ` : ''}${String(minutes % 60).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsRunning(false);
      onComplete(id);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, remainingTime]);

  const handleStart = () => {
    if (!completed) {
      setIsRunning(true);
      onStart(id);
    }
  };

  function handleComplete() {
    setIsRunning(false);
    onComplete(id);
  }

  return (
    <div 
      className={`gap-2 flex justify-between items-center py-2 px-3 rounded-xl mb-3 transition-all duration-300 ease-in-out ${
        completed 
          ? 'bg-slate-800/70 border-l-4 border-emerald-400' 
          : 'bg-slate-900/70 border-l-4 border-indigo-500'
      }`}
    >
      <div className="flex-1 flex flex-col items-start">
        <h3 className={`m-0 text-sm font-medium text-left ${completed ? 'text-slate-300' : 'text-white'}`}>
          {title}
        </h3>
        <p className="m-0 text-sm text-slate-400 mt-1">{formatTime(remainingTime)}</p>
      </div>
      <div className="flex gap-2 h-[2.1rem]">
        {!completed && !isRunning && (
          <button 
            onClick={handleStart} 
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
            aria-label="Start task"
          >
            <Play size={18} />
          </button>
        )}
        <button 
          onClick={handleComplete} 
          className={`p-2 rounded-full transition-colors duration-200 ${
            completed 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          aria-label="Complete task"
        >
          <CheckCircle size={18} />
        </button>
        <button 
          onClick={() => onDelete(id)} 
          className="p-2 rounded-full bg-slate-700 text-slate-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;