import { setTasks } from "../imports";
import updateTaskOnServer from "../updateTaskOnServer";
import getTasksFromServer from "../getTasksFromServer";

const toggleComplete = (id, val) => {
    updateTaskOnServer(id, { status: val });
    getTasksFromServer().then((tasks) => setTasks(tasks));
}

export default toggleComplete;