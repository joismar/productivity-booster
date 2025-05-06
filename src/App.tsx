import React from 'react';
import './App.css';
import TaskItem from './components/TaskItem';
import { PlusIcon } from 'lucide-react';

type Task = {
  id: number;
  time: number;
  title: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = React.useState('');
  const [taskTime, setTaskTime] = React.useState(60);

  React.useEffect(() => {
    window.ipcRenderer.on('tasks-data', (_event, ...args) => {
      const storedTasks = args[0] as Task[];
      setTasks(storedTasks);
    })
  }, []);

  React.useEffect(() => {
    window.ipcRenderer.send('set-tasks-data', tasks);
  }, [tasks]);

  function handleClose() {
    window.ipcRenderer.send('set-tasks-data', tasks);
    window.ipcRenderer.send('close-app');
  }

  function handleAddTask(title: string, time: number) {
    const maxTaskId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) : 0;
    const newTask: Task = {
      id: maxTaskId + 1,
      time,
      title,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  }

  function handleDeleteTask(id: number) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  function handleStartTask(id: number) {
    console.log(`Start task ${id}`);
    // Placeholder for starting task logic
  }

  function handleCompleteTask(id: number) {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: true } : task)));
  }

  function handleChangeTaskTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setTaskTitle(event.target.value);
  }

  function handleChangeTaskTime(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value, 10);
    setTaskTime(value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (taskTitle.trim() === '') return;
    handleAddTask(taskTitle, taskTime);
    setTaskTitle('');
    setTaskTime(60);
  }

  return (
    <div>
      <header className={`h-10 px-2 pl-4 flex justify-between items-center grab-area bg-slate-900/70 rounded-t-md`}>
        <div className=''>
          <h1 className='text-xl font-bold m-0'>Tasks</h1>
        </div>
        <button className='no-grab-area bg-transparent outline-none border-none cursor-pointer h-6 text-sm pr-1' onClick={handleClose}>
          ✕
        </button>
      </header>
      <div className='h-1'></div>
      <main className='h-[calc(100vh-3rem)] bg-slate-900/70 rounded-b-md flex flex-col'>
        <div className='p-4 flex-1 overflow-y-auto'>
          <div className='list-disc'>
            {tasks
              .sort((a, b) => Number(a.completed) - Number(b.completed))
              .map(task => (
                <TaskItem
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  time={task.time}
                  completed={task.completed}
                  onDelete={handleDeleteTask}
                  onStart={handleStartTask}
                  onComplete={handleCompleteTask}
                />
              ))}
          </div>
        </div>
        <form className='flex justify-between items-center p-4 gap-2 border-t border-gray-700' onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Take a coffee" 
            value={taskTitle} 
            onChange={handleChangeTaskTitle} 
            className='h-6 flex-1 border-white-1 border-solid bg-transparent text-white outline-none px-2 py-1 rounded-md'
          />
          <input
            type="number"
            placeholder="Time (minutes)"
            value={taskTime}
            onChange={handleChangeTaskTime}
            className='h-6 w-16 border-white-1 border-solid bg-transparent text-white outline-none px-2 py-1 rounded-md'
          />
          <button className='p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200 h-[2.1rem] w-[2.1rem]' type='submit'>
            <PlusIcon size={18} />
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;