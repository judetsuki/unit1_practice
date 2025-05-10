import { useState } from "react"

export default function Task({task, setTasks}) {
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [isEditing, setIsEditing] = useState(false)
    
    console.log(task)
    return (
        <div className="task">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {/* <button onClick={() => deleteTask(task.id, setTasks)}>Delete</button>
            <button onClick={() => editTask(task.id, task, setTasks)}>Edit</button> */}
        </div>
    )
}