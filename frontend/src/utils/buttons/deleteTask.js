import deleteTaskFromServer from '../deleteTaskFromServer.js';
import getTasksFromServer from '../getTasksFromServer.js';


const deleteTask = (id,setTasks) => {
  deleteTaskFromServer(id);
  getTasksFromServer()
    .then((tasks) => {
      setTasks(tasks);
    })
}

export default deleteTask;

//этот файл больше не нужен по идее