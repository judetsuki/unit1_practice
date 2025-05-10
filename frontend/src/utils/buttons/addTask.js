import postTasksToServer from "../postTasksToServer.js";
import getTasksFromServer from "../getTasksFromServer.js";
import { v4 as uuidv4 } from 'uuid';


const addTask = (e, setTasks) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
        title: form.taskTitle.value,
        description: 'Add description here!',
        status: false,
        id: uuidv4(),
    };

    postTasksToServer(formData)
    .then((response) => {
      console.log(response);
    })
    .then(() => {
      getTasksFromServer()
      .then((response) => {
        setTasks(response)
      }).catch((error) => {
        throw new Error(error);
      })
    })
    .catch((error) => {
      throw new Error(error);
    })
};

export default addTask;
