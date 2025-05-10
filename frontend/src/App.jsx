import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './pageStyles.css';
import './buttonStyles.css';
import postTasksToServer from "../src/utils/postTasksToServer";
import getTasksFromServer from "../src/utils/getTasksFromServer";
import deleteTaskFromServer from './utils/deleteTaskFromServer';
import updateTaskOnServer from './utils/updateTaskOnServer';
import Task from './react_components/task'
import TaskList from './react_components/taskList';

// const TaskMenu = React.memo(function TaskMenu({ value, onChange, placeholder }) {
//   const textareaRef = useRef(null);
//   useEffect(() => {
//     if (textareaRef.current) {
//       const textarea = textareaRef.current;
//       const { selectionStart, selectionEnd } = textarea;
//       textarea.style.height = 'auto';
//       textarea.style.height = `${textarea.scrollHeight}px`;
//       textarea.setSelectionRange(selectionStart, selectionEnd);
//       textarea.focus();
//     }
//   }, [value]);

//   return (
//     <textarea
//       ref={textareaRef}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className='task-menu-textarea'
//       placeholder={placeholder}
//     />
//   );
// });
// TaskMenu.propTypes = {
//   value: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
//   placeholder: PropTypes.string,
// };

function App() {
  return (
    <TaskList></TaskList>
  )
}

export default App;
