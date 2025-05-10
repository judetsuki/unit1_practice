import axios from 'axios'

const FLASK_API = 'https://task-tracker-daniel.loca.lt/tasks';

const deleteTaskFromServer = async (taskId) => {
    try {
        const response = await axios.delete(`${FLASK_API}/${taskId}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export default deleteTaskFromServer;