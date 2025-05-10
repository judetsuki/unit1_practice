import axios from 'axios';

const FLASK_API = 'https://task-tracker-daniel.loca.lt/tasks';
const username = '';
const password = '31.134.142.166';

const updateTaskOnServer = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${FLASK_API}/${taskId}`, taskData, {
      auth: {
        username: username,
        password: password,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task on server:', error);
    throw error;
  }
}

updateTaskOnServer(27, { status: true })

export default updateTaskOnServer;
