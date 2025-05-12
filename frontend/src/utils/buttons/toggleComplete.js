import { setTasks } from "../imports";
import updateTaskOnServer from "../updateTaskOnServer";
import getTasksFromServer from "../getTasksFromServer";

const toggleComplete = (id) => {
    updateTaskOnServer(id, { completed: !tasks[id].completed });
    getTasksFromServer().then((tasks) => setTasks(tasks));
}

export default toggleComplete;