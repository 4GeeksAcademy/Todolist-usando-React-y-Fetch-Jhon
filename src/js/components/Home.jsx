import React, { useState, useEffect } from "react";
import axios from "axios";

// 

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Función para traer las tareas del servidor
    const fetchTasks = async () => {
        try {
            const res = await axios.get('https://literate-fiesta-q79gv4wjr69pfr9v-5000.app.github.dev/api/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error("Error: El servidor no responde. ¿Encendiste el backend?", error);
        }
    };

    // Se ejecuta una sola vez al cargar la página
    useEffect(() => {
        fetchTasks();
    }, []);

    // Función para agregar tarea
    const addTask = async (e) => {
        if (e.key === "Enter" || e.type === "click") {
            if (newTask.trim() === "") return;
            
            try {
                await axios.post('https://literate-fiesta-q79gv4wjr69pfr9v-5000.app.github.dev/api/tasks', { 
                    title: newTask, 
                    priority: "Normal" 
                });
                setNewTask(""); // Limpiar input
                fetchTasks();   // Recargar lista
            } catch (error) {
                alert("Error al guardar. Asegúrate de que el servidor esté corriendo.");
            }
        }
    };

    // Función para borrar tarea
    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error("No se pudo borrar la tarea", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 card shadow p-4">
                    <h1 className="text-center mb-4">Mi Lista de Tareas</h1>
                    
                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control"
                            placeholder="¿Qué necesitas hacer hoy?"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={addTask}
                        />
                        <button className="btn btn-primary" onClick={addTask}>
                            Agregar
                        </button>
                    </div>

                    <ul className="list-group">
                        {tasks.length === 0 ? (
                            <li className="list-group-item text-center text-muted">
                                No hay tareas. ¡Añade una!
                            </li>
                        ) : (
                            tasks.map((task) => (
                                <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {task.title}
                                    <button 
                                        className="btn btn-outline-danger btn-sm border-0" 
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        X
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                    <div className="card-footer text-muted small mt-3">
                        {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} pendientes
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;