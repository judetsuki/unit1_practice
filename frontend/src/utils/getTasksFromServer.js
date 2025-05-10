import axios from 'axios'

const FLASK_API = 'https://task-tracker-daniel.loca.lt/tasks';
const username = '';
const password = '31.134.142.166';

const getTasksFromServer = async () => {
  try {
    const response = await axios.get(FLASK_API, {
      auth: {
        username: username,
        password: password,
      }
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default getTasksFromServer;
