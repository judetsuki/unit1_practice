import React, { useState } from 'react';
import './pageStyles.css';
import './buttonStyles.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [flagStates, setFlagStates] = useState({});

  const addTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskText('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setFlagStates((prev) => {
      const newFlags = { ...prev };
      delete newFlags[id];
      return newFlags;
    });
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleFlagOpacity = (id) => {
    setFlagStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className='container'>
      <h1 className='heading'>Task Tracker</h1>
      <form onSubmit={addTask} className='form'>
        <input
          type='text'
          placeholder='Add new task'
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className='input'
        />
        <button type='submit' className='button'>
          Add
        </button>
      </form>
      <ul className='list'>
        {tasks.length === 0 && <li className='no-tasks'>No tasks yet</li>}
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`list-item${task.completed ? ' completed' : ''}`}
          >
            <span onClick={() => toggleComplete(task.id)} className='task-text'>
              {task.text}
            </span>
            {!task.completed && (
              <img
                src='/flag.png'
                alt='Priority'
                className='priority-flag'
                title='Priority Task'
                style={{
                  opacity: flagStates[task.id] ? 1 : 0.5,
                  cursor: 'pointer',
                }}
                onClick={() => toggleFlagOpacity(task.id)}
              />
            )}
            <button
              onClick={() => deleteTask(task.id)}
              className='delete-button'
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
