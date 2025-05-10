import checkIfTaskValid from "./checkIfTaskValid.js";
import axios from "axios"

const FLASK_API = 'https://task-tracker-daniel.loca.lt/tasks'
const username = '';
const password = '31.134.142.166';

const postTasksToServer = async (task) => {
  if (checkIfTaskValid(task)) {
    console.log(task)
    try {
      const response = await axios.post(FLASK_API, task, {
        auth: {
          username: username,
          password: password,
        }
      });
      const data = response.data;
      console.log(response.data)
      return data;
    } catch (error) {
      console.error('Error:', error);
      return 0;
    }
  } else {
    throw new Error(checkIfTaskValid(task).error)
  }
}

export default postTasksToServer;
