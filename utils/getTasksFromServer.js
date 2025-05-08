import exios from 'axios'

const FLASK_API = 'https://task-tracker-daniel.loca.lt/tasks';

const getTasksFromServer = async () => {
  try {
    const response = await exios.get(FLASK_API);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default getTasksFromServer;