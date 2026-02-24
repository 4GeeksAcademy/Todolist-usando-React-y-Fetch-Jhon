import React, { useState, useEffect } from "react";

const Home = () => {
	const [newTask, setNewTask] = useState("");
	const [tasks, setTasks] = useState([]);
	const userName = "Neo1917"; 


	const API_URL = `https://playground.4geeks.com/todo/users/${userName}`;

	// 1. OBTENER TAREAS (GET)
	const fetchTasks = async () => {
		try {
			const response = await fetch(API_URL);
			if (response.ok) {
				const data = await response.json();
				setTasks(data.todos); // En esta API, las tareas vienen en .todos
			} else if (response.status === 404) {
				// Si el usuario no existe, lo creamos
				createUser();
			}
		} catch (error) {
			console.error("Error al cargar:", error);
		}
	};

	// 2. CREAR USUARIO (Si no existe)
	const createUser = async () => {
		await fetch(API_URL, { method: "POST" });
		fetchTasks();
	};

	// 3. AGREGAR TAREA (POST)
	const addTask = async (e) => {
		if (e.key === "Enter" && newTask.trim() !== "") {
			try {
				const response = await fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
					method: "POST",
					body: JSON.stringify({
						label: newTask,
						is_done: false
					}),
					headers: { "Content-Type": "application/json" }
				});
				if (response.ok) {
					setNewTask("");
					fetchTasks();
				}
			} catch (error) {
				console.error("Error al agregar:", error);
			}
		}
	};

	// 4. ELIMINAR TAREA (DELETE)
	const deleteTask = async (id) => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE"
			});
			if (response.ok) fetchTasks();
		} catch (error) {
			console.error("Error al borrar:", error);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<h1 className="text-center display-4">Mi Lista de Tareas</h1>
			<div className="card shadow-sm">
				<ul className="list-group list-group-flush">
					<li className="list-group-item">
						<input
							type="text"
							className="form-control border-0 shadow-none"
							placeholder="¿Qué necesitas hacer hoy?"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							onKeyDown={addTask}
						/>
					</li>
					{tasks.length === 0 ? (
						<li className="list-group-item text-center text-muted">No hay tareas. ¡Añade una!</li>
					) : (
						tasks.map((task) => (
							<li key={task.id} className="list-group-item d-flex justify-content-between align-items-center task-item">
								{task.label}
								<span className="text-danger cursor-pointer" onClick={() => deleteTask(task.id)}>X</span>
							</li>
						))
					)}
				</ul>
				<div className="card-footer text-muted small">
					{tasks.length} {tasks.length === 1 ? "tarea pendiente" : "tareas pendientes"}
				</div>
			</div>
		</div>
	);
};

export default Home;