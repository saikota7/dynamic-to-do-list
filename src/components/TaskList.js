import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TaskList.css'; // Import the CSS file

const API_BASE_URL = 'http://localhost:5000';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await axios.get(`${API_BASE_URL}/tasks`);
        setTasks(res.data);
    };

    const createTask = async () => {
        const res = await axios.post(`${API_BASE_URL}/tasks`, { text: newTask });
        setTasks([...tasks, res.data]);
        setNewTask('');
    };

    const updateTaskStatus = async (id, status) => {
        const res = await axios.put(`${API_BASE_URL}/tasks/${id}`, { status });
        setTasks(tasks.map(task => (task._id === id ? res.data : task)));
    };

    const deleteTask = async id => {
        await axios.delete(`${API_BASE_URL}/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
    };

    const onDragEnd = result => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const movedTask = tasks.find(task => task._id === result.draggableId);
            updateTaskStatus(result.draggableId, destination.droppableId);
            setTasks(tasks.map(task =>
                task._id === result.draggableId ? { ...task, status: destination.droppableId } : task
            ));
        } else {
            // Reordering within the same column
            const reorderedTasks = Array.from(tasks);
            const [removed] = reorderedTasks.splice(source.index, 1);
            reorderedTasks.splice(destination.index, 0, removed);
            setTasks(reorderedTasks);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="container">
                {['to-do', 'in-progress', 'done'].map(status => (
                    <Droppable key={status} droppableId={status}>
                        {provided => (
                            <div
                                className="section"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h2>{status.toUpperCase()}</h2>
                                <div className="task-list">
                                    {tasks
                                        .filter(task => task.status === status)
                                        .map((task, index) => (
                                            <Draggable
                                                key={task._id}
                                                draggableId={task._id}
                                                index={index}
                                            >
                                                {provided => (
                                                    <div
                                                        className="task"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Task
                                                            task={task}
                                                            updateTaskStatus={updateTaskStatus}
                                                            deleteTask={deleteTask}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                                {status === 'to-do' && (
                                    <>
                                        <input
                                            className="new-task-input"
                                            value={newTask}
                                            onChange={e => setNewTask(e.target.value)}
                                            placeholder="New Task"
                                        />
                                        <button className="create-task-button" onClick={createTask}>+ Create issue</button>
                                    </>
                                )}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default TaskList;
