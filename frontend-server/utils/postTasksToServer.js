import checkIfTaskValid from "./checkIfTaskValid.js";
import axios from "axios"
import fs from "fs"

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
    fs.writeFileSync('./debug.html', error.data);
    return 0;
  }
  } else {
    throw new Error(checkIfTaskValid(task).error)
  }
}

const taksa = {
  title: 'LUKA GEROI!!!',
  description: 'test',
  status: 'test',
  due_date: '2025-05-10T15:00:00',
}

postTasksToServer(taksa);

export default postTasksToServer;