import deleteTaskFromServer from '../deleteTaskFromServer.js';
import getTasksFromServer from '../getTasksFromServer.js';
import { setTasks } from '../../App.jsx'; 

const deleteTask = (id) => {
  deleteTaskFromServer(id);
  getTasksFromServer()
    .then((tasks) => {
      setTasks(tasks);
    })
}

export default deleteTask;