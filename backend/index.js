require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { ethers } = require("ethers");
const cors = require('cors')
// const axios = require("axios");
const taskRoute = require('./routes/taskRoute')

const app = express();
app.use(express.json());
app.use(cors());
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// const TaskSchema = new mongoose.Schema({
//     taskId: Number,
//     name: String,
//     user: String,
//     completed: Boolean,
//     priority: String
// });

// const Task = mongoose.model("Task", TaskSchema);

// AI Task Prioritization
// const prioritizeTask = async (taskName) => {
//     const response = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         { model: "gpt-3.5-turbo", messages: [{ role: "system", content: `Prioritize this task: ${taskName}` }] },
//         { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
//     );
//     return response.data.choices[0].message.content;
// };

// Create Task
// app.post("/tasks", async (req, res) => {
//     const { taskId, name, user } = req.body;
//     const priority = await prioritizeTask(name);

//     const newTask = new Task({ taskId, name, user, completed: false, priority });
//     await newTask.save();

//     res.json(newTask);
// });

// // Get Tasks
// app.get("/tasks", async (req, res) => {
//     const tasks = await Task.find();
//     res.json(tasks);
// });

// // Mark Task Complete (On-Chain)
// app.post("/tasks/complete", async (req, res) => {
//     const { taskId, userPrivateKey } = req.body;

//     const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_RPC);
//     const wallet = new ethers.Wallet(userPrivateKey, provider);
//     const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ["function completeTask(uint256 _taskId) public"], wallet);

//     const tx = await contract.completeTask(taskId);
//     await tx.wait();

//     await Task.findOneAndUpdate({ taskId }, { completed: true });

//     res.json({ message: "Task completed successfully" });
// });
app.use('/api',taskRoute)
app.listen(5000, () => console.log("Server running on port 5000"));
