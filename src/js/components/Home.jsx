import React, { useState, useEffect } from "react";

const Home = () => {
	const [newTask, setNewTask] = useState("");
	const [tasks, setTasks] = useState([]);
	
	
	const userName = "Neo1917"; 
	
	const API_BASE_URL = "https://playground.4geeks.com/todo";

	// 1. CARGAR TAREAS AL INICIAR (GET)
	const fetchTasks = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/users/${userName}`);
			if (response.status === 404) {
				// Si el usuario no existe (error 404), intentamos crearlo
				console.log("Usuario no encontrado, creando...");
				await createUser();
			} else if (response.ok) {
				const data = await response.json();
				setTasks(data.todos); // Guardamos la lista del servidor en el estado
			}
		} catch (error) {
			console.error("Error cargando tareas:", error);
		}
	};

	// 2. CREAR USUARIO (POST a /users/)
	const createUser = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/users/${userName}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" }
			});
			if (response.ok) {
				console.log("Usuario creado con éxito");
				fetchTasks(); // Una vez creado, intentamos traer la lista (vacía al inicio)
			}
		} catch (error) {
			console.error("Error creando usuario:", error);
		}
	};

	// 3. AGREGAR UNA TAREA (POST a /todos/)
	const addTask = async (e) => {
		if (e.key === "Enter" && newTask.trim() !== "") {
			try {
				const response = await fetch(`${API_BASE_URL}/todos/${userName}`, {
					method: "POST",
					body: JSON.stringify({
						label: newTask,
						is_done: false
					}),
					headers: { "Content-Type": "application/json" }
				});
				if (response.ok) {
					setNewTask(""); // Limpiamos el input
					fetchTasks(); // Refrescamos la lista desde el servidor (GET)
				}
			} catch (error) {
				console.error("Error añadiendo tarea:", error);
			}
		}
	};

	// 4. ELIMINAR UNA TAREA (DELETE a /todos/id)
	const deleteTask = async (id) => {
		try {
			const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
				method: "DELETE"
			});
			if (response.ok) {
				fetchTasks(); // Refrescamos la lista tras borrar (GET)
			}
		} catch (error) {
			console.error("Error eliminando tarea:", error);
		}
	};

	// 5. LIMPIAR TODAS LAS TAREAS (Eliminar usuario y recrearlo es lo más eficiente en esta API)
	const clearAllTasks = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/users/${userName}`, {
				method: "DELETE"
			});
			if (response.ok) {
				setTasks([]); // Limpiamos el front-end
				await createUser(); // Recreamos el usuario para que la lista esté lista de nuevo
			}
		} catch (error) {
			console.error("Error limpiando lista:", error);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<h1 className="text-center display-4 mb-4">Todo List</h1>
			<div className="card shadow">
				<ul className="list-group list-group-flush">
					<li className="list-group-item">
						<input
							type="text"
							className="form-control border-0 shadow-none"
							placeholder="¿Qué falta por hacer?"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							onKeyDown={addTask}
						/>
					</li>
					{tasks.length === 0 ? (
						<li className="list-group-item text-center text-muted">No hay tareas pendientes.</li>
					) : (
						tasks.map((task) => (
							<li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
								{task.label}
								<button 
									className="btn btn-sm text-danger opacity-50 btn-delete" 
									onClick={() => deleteTask(task.id)}
								>
									X
								</button>
							</li>
						))
					)}
				</ul>
				<div className="card-footer d-flex justify-content-between align-items-center bg-light">
					<small className="text-muted">{tasks.length} items left</small>
					<button className="btn btn-outline-danger btn-sm" onClick={clearAllTasks}>
						Limpiar todo
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;