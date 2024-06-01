import React from 'react';
import './TaskList.css'; // Import the CSS file

const Task = ({ task, updateTaskStatus, deleteTask }) => {
    return (
        <div className="task-container">
            <div className="task-content">
                <span>{task.text}</span>
                <div className="task-actions">
                    {task.status !== 'to-do' && (
                        <button onClick={() => updateTaskStatus(task._id, 'to-do')}>TO DO</button>
                    )}
                    {task.status !== 'in-progress' && (
                        <button onClick={() => updateTaskStatus(task._id, 'in-progress')}>IN PROGRESS</button>
                    )}
                    {task.status !== 'done' && (
                        <button onClick={() => updateTaskStatus(task._id, 'done')}>DONE</button>
                    )}
                    <button onClick={() => deleteTask(task._id)}>DELETE</button>
                </div>
            </div>
        </div>
    );
};

export default Task;
