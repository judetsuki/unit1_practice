import React, { useState, useRef, useEffect } from 'react';
import './pageStyles.css';
import './buttonStyles.css';

const TaskMenu = React.memo(function TaskMenu({ value, onChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart, selectionEnd } = textarea;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
      textarea.setSelectionRange(selectionStart, selectionEnd);
      textarea.focus();
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='task-menu-textarea'
      placeholder='Write notes here...'
      style={{ overflow: 'hidden', direction: 'ltr', textAlign: 'left' }}
    />
  );
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [flagStates, setFlagStates] = useState({});
  const [openMenuTaskId, setOpenMenuTaskId] = useState(null);
  const [menuTexts, setMenuTexts] = useState({}); 
  const [tempMenuText, setTempMenuText] = useState(''); 

  const containerRef = useRef(null);
  const taskRefs = useRef({}); 

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
      setTempMenuText('');
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
    if (openMenuTaskId === id) {

      setOpenMenuTaskId(null);
      setTempMenuText('');
    } else {

      setOpenMenuTaskId(id);
      setTempMenuText(menuTexts[id] || '');
    }
  };

  const handleTempMenuTextChange = (value) => {
    setTempMenuText(value);
  };

  const handleSave = () => {
    if (openMenuTaskId !== null) {
      setMenuTexts((prev) => ({
        ...prev,
        [openMenuTaskId]: tempMenuText,
      }));
      setOpenMenuTaskId(null);
      setTempMenuText('');
    }
  };

  const handleClose = () => {
    setOpenMenuTaskId(null);
    setTempMenuText('');
  };


  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => {
    if (
      openMenuTaskId !== null &&
      taskRefs.current[openMenuTaskId] &&
      containerRef.current
    ) {
      const taskEl = taskRefs.current[openMenuTaskId];
      const containerEl = containerRef.current;

      const containerRect = containerEl.getBoundingClientRect();
      const taskRect = taskEl.getBoundingClientRect();

      const top = taskRect.bottom - containerRect.top + 5;
      const left = 0;
      const width = containerEl.clientWidth;

      setMenuStyle({
        position: 'absolute',
        top: top + 'px',
        left: left + 'px',
        width: width + 'px',
        zIndex: 1000,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      });
    } else {
      setMenuStyle({});
    }
  }, [openMenuTaskId, tasks]);

  return (
    <div className='container' style={{ position: 'relative' }} ref={containerRef}>
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
            ref={(el) => (taskRefs.current[task.id] = el)}
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
                  title='Edit'
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
            <button onClick={() => deleteTask(task.id)} className='delete-button'>
              &times;
            </button>
          </li>
        ))}
      </ul>
      {openMenuTaskId !== null && (
        <div className='task-menu' style={menuStyle}>
          <TaskMenu value={tempMenuText} onChange={handleTempMenuTextChange} />
          <button onClick={handleSave} className='task-menu-save-button'>
            Save
          </button>
          <button onClick={handleClose} className='task-menu-close-button'>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
