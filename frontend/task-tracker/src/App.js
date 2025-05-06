import React, { useState } from 'react';
import './pageStyles.css';
import './buttonStyles.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

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
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="container">
      <h1 className="heading">Task Tracker</h1>
      <form onSubmit={addTask} className="form">
        <input
          type="text"
          placeholder="Add new task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="input"
        />
        <button
          type="submit"
          className="button"
        >
          Add
        </button>
      </form>
      <ul className="list">
        {tasks.length === 0 && (
          <li className="no-tasks">No tasks yet</li>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`list-item${task.completed ? ' completed' : ''}`}
          >
            <span onClick={() => toggleComplete(task.id)} className="task-text">
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="delete-button"
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
