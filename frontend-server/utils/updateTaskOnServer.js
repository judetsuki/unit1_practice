import axios from 'axios';

const FLASK_API = 'https://task-tracker-daniel.loca.lt/tasks';

const updateTaskOnServer = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${FLASK_API}/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task on server:', error);
    throw error;
  }
}

updateTaskOnServer(27, { status: true })

export default updateTaskOnServer;