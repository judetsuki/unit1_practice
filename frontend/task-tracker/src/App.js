import React, { useState, useRef, useEffect } from 'react';
import './pageStyles.css';
import './buttonStyles.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [flagStates, setFlagStates] = useState({});
  const [openMenuTaskId, setOpenMenuTaskId] = useState(null);
  const [menuTexts, setMenuTexts] = useState({}); // Store text for each task's menu

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
    setMenuTexts((prev) => {
      const newTexts = { ...prev };
      delete newTexts[id];
      return newTexts;
    });
    if (openMenuTaskId === id) {
      setOpenMenuTaskId(null);
    }
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

  const toggleMenu = (id) => {
    setOpenMenuTaskId((prev) => (prev === id ? null : id));
  };

  const handleMenuTextChange = (id, value) => {
    setMenuTexts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  function TaskMenu({ value, onChange }) {
    const textareaRef = useRef(null);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + 'px';
      }
    }, [value]);

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        className='task-menu-textarea'
        placeholder='Write notes here...'
        style={{ overflow: 'hidden' }}
      />
    );
  }

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
              <>
                <img
                  src='/paperstack.png'
                  alt='Notes'
                  className='paperstack-icon'
                  title='Open Notes'
                  onClick={() => toggleMenu(task.id)}
                  style={{ cursor: 'pointer', marginLeft: '8px' }}
                />
                <img
                  src='/flag.png'
                  alt='Priority'
                  className='priority-flag'
                  title='Priority Task'
                  style={{
                    opacity: flagStates[task.id] ? 1 : 0.5,
                    cursor: 'pointer',
                    marginLeft: '8px',
                  }}
                  onClick={() => toggleFlagOpacity(task.id)}
                />
              </>
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
      {openMenuTaskId !== null && (
        <div className='task-menu'>
          <textarea
            value={menuTexts[openMenuTaskId] || ''}
            onChange={(e) =>
              handleMenuTextChange(openMenuTaskId, e.target.value)
            }
            className='task-menu-textarea'
            placeholder='Write notes here...'
          />
          <button
            onClick={() => setOpenMenuTaskId(null)}
            className='task-menu-close-button'
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
