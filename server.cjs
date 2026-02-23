const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Esta es tu "base de datos" temporal en memoria
let tasks = [
    { id: 1, title: "¡Bienvenido! Tu servidor funciona", priority: "Alta" }
];

// Ruta para obtener las tareas
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// Ruta para agregar una tarea nueva
app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: Date.now(),
        title: req.body.title,
        priority: req.body.priority || "Normal"
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Ruta para eliminar una tarea
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== id);
    res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`>>> Servidor encendido en el puerto ${PORT}`);
});