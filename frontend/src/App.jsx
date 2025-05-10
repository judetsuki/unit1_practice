import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './pageStyles.css';
import './buttonStyles.css';
import postTasksToServer from "../src/utils/postTasksToServer";
import getTasksFromServer from "../src/utils/getTasksFromServer";
import deleteTaskFromServer from './utils/deleteTaskFromServer';
import updateTaskOnServer from './utils/updateTaskOnServer';

const TaskMenu = React.memo(function TaskMenu({ value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart, selectionEnd } = textarea;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
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
      placeholder={placeholder}
    />
  );
});

TaskMenu.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [flagStates, setFlagStates] = useState({});
  const [openMenuTaskId, setOpenMenuTaskId] = useState(null);
  const [menuTexts, setMenuTexts] = useState({});
  const [tempMenuText, setTempMenuText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  const containerRef = useRef(null);
  const taskRefs = useRef({});

  useEffect(() => {
    getTasksFromServer()
      .then((data) => {
        setTasks(data);
        // Initialize menuTexts with descriptions from server
        const descriptions = {};
        data.forEach(task => {
          descriptions[task.id] = task.description || '';
        });
        setMenuTexts(descriptions);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    const formData = {
      title: taskTitle,
      description: taskDescription,
    };
    postTasksToServer(formData)
      .then(() => {
        return getTasksFromServer();
      })
      .then((data) => {
        setTasks(data);
        // Update menuTexts with new descriptions
        const descriptions = {};
        data.forEach(task => {
          descriptions[task.id] = task.description || '';
        });
        setMenuTexts(descriptions);
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };

  const deleteTask = (id) => {
    deleteTaskFromServer(id)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        setMenuTexts((prev) => {
          const newTexts = { ...prev };
          delete newTexts[id];
          return newTexts;
        });
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });

    setFlagStates((prev) => {
      const newFlags = { ...prev };
      delete newFlags[id];
      return newFlags;
    });

    if (openMenuTaskId === id) {
      setOpenMenuTaskId(null);
      setTempMenuText('');
    }
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task
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

  const handleSave = (id, task) => {
    if (openMenuTaskId !== null) {
      setMenuTexts((prev) => ({
        ...prev,
        [openMenuTaskId]: tempMenuText,
      }));
      setOpenMenuTaskId(null);
      setTempMenuText('');
      updateTaskOnServer(id, task)
        .then(() => {
          return getTasksFromServer();
        })
        .then((data) => {
          setTasks(data);
          // Update menuTexts with new descriptions
          const descriptions = {};
          data.forEach(task => {
            descriptions[task.id] = task.description || '';
          });
          setMenuTexts(descriptions);
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  };

  const handleClose = () => {
    setOpenMenuTaskId(null);
    setTempMenuText('');
  };

  return (
    <div className='container' ref={containerRef}>
      <h1 className='heading'>Task Tracker</h1>
      <form onSubmit={addTask} className='form'>
        <input
          type='text'
          placeholder='Add new task'
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className='input'
        />
        <button type='submit' className='button'>Add</button>
      </form>

      <ul className='list'>
        {tasks.length === 0 && <li className='no-tasks'>No tasks yet</li>}
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`list-item${task.status ? ' status' : ''}`}
            ref={(el) => (taskRefs.current[task.id] = el)}
          >
            {editingTaskId === task.id ? (
              <input
                type='text'
                value={editingTaskTitle}
                onChange={(e) => setEditingTaskTitle(e.target.value)}
                onBlur={() => {
                  if (editingTaskTitle.trim() === '') {
                    setEditingTaskTitle(task.title);
                  } else {
                    setTasks((prevTasks) =>
                      prevTasks.map((t) =>
                        t.id === task.id ? { ...t, title: editingTaskTitle } : t
                      )
                    );
                  }
                  setEditingTaskId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.target.blur();
                  }
                  if (e.key === 'Escape') {
                    setEditingTaskTitle(task.title);
                    setEditingTaskId(null);
                  }
                }}
                autoFocus
                className='task-edit-input'
              />
            ) : (
              <span onClick={() => toggleComplete(task.id)} className='task-text'>
                {task.title}
              </span>
            )}
            <>
              <img
                src='/assets/edit.png'
                alt='Edit Task Title'
                className='edit-icon'
                title='Edit Task Title'
                onClick={() => {
                  setEditingTaskId(task.id);
                  setEditingTaskTitle(task.title);
                }}
              />
              <img
                src='/assets/paperstack.png'
                alt='Notes'
                className='paperstack-icon'
                title='Edit'
                onClick={() => toggleMenu(task.id)}
              />
              <img
                src='/assets/flag.png'
                alt='Priority'
                className={`priority-flag ${flagStates[task.id] ? 'flag-opacity-on' : 'flag-opacity-off'}`}
                title='Priority Task'
                onClick={() => toggleFlagOpacity(task.id)}
              />
            </>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  deleteTask(task.id);
                }
              }}
              className='delete-button'
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      {openMenuTaskId !== null && (
        <div
          className='task-menu task-menu-open'
          style={{
            top: `${taskRefs.current[openMenuTaskId].getBoundingClientRect().bottom - containerRef.current.getBoundingClientRect().top + 5}px`,
            left: 0,
            width: `${containerRef.current.clientWidth}px`,
          }}
        >
          <TaskMenu
            value={tempMenuText}
            onChange={setTempMenuText}
            placeholder='Write notes here...'
          />
          <button onClick={() => handleSave(openMenuTaskId, { description: tempMenuText })} className='task-menu-save-button'>Save</button>
          <button onClick={handleClose} className='task-menu-close-button'>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
