const Task = require('../models/taskModel');
const logger = require('../../../utils/logger');


exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Please provide both title and description' });
        }

        const task = await Task.create({
            user: req.user.id, 
            title,
            description
        });

        return res.status(201).json({ success: true, data: task });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        let tasks;

        if (req.user.role === 'admin') {
            tasks = await Task.find().populate('user', 'email role');
        } else {
            tasks = await Task.find({ user: req.user.id });
        }

        return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

   
        if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
        }


        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;

        const updatedTask = await task.save();
        return res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();
        return res.status(200).json({ success: true, message: 'Task removed successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};