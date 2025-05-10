import checkIfTaskValid from "./checkIfTaskValid.js";
import axios from "axios"

const FLASK_API = 'https://task-tracker-daniel.loca.lt/tasks'

const postTasksToServer = async (task) => {
  if (checkIfTaskValid(task)) {
  console.log(task)
  try {
    const response = await axios.post(FLASK_API, task);
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

postTasksToServer({title: 'test', description: 'test'})

export default postTasksToServer;