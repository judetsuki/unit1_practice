import postTasksToServer from "../postTasksToServer";
import getTasksFromServer from "../getTasksFromServer";
import { setTasks } from "imports.js";

const addTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
        title: form.titleText.value,
        description: 'Add description here!',
        status: 'pending',
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