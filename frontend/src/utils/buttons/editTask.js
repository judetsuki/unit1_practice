import { setTasks } from "../imports";
import updateTaskOnServer from "../updateTaskOnServer";
import getTasksFromServer from "../getTasksFromServer";

const editTask = (id, task) => {
  updateTaskOnServer(id, task);
  getTasksFromServer().then((tasks) => setTasks(tasks));
}

export default editTask;