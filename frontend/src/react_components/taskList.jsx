import { useState, useEffect } from "react";
import getTasksFromServer from "../utils/getTasksFromServer";
import Task from './task'

export default function TaskList(props) {
    const [tasks, setTasks] = useState([]);
    console.log('!!!!!!!!!!!!!!')
    console.log(tasks)

    useEffect(() => {
      getTasksFromServer().then((tasks) => {
        setTasks(tasks);
      });
    }, []);

    return (
      <ul class='task-list'>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </ul>
    )
}