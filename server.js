const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/student_tasks', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Task Schema
const taskSchema = new mongoose.Schema({
    courseID: String,
    taskName: String,
    dueDate: Date,
    details: String
});

const Task = mongoose.model('Task', taskSchema); // Create a Mongoose model from the schema

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to add a task
app.post('/tasks', async (req, res) => {
    try {
        const { courseID, taskName, dueDate, details } = req.body;
        const task = new Task({ courseID, taskName, dueDate, details });
        await task.save();
        res.status(201).send('Task added successfully!');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Failed to add task.');
    }
});

// Route to retrieve tasks by courseID
app.get('/courses/:courseID/tasks', async (req, res) => {
    try {
        const { courseID } = req.params;
        const tasks = await Task.find({ courseID });
        if (tasks.length === 0) {
            res.status(404).json({ error: 'No tasks found for the specified course.' });
        } else {
            res.status(200).json(tasks);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Failed to retrieve tasks.');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
