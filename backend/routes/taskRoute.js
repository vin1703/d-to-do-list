const express = require('express');
require("dotenv").config();
const { ethers } = require("ethers");

const router = express.Router();

// Utility to get contract instance
const getContractInstance = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
  );

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  return new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    JSON.parse(process.env.CONTRACTABI),
    signer
  );
};

// Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const task = req.body.task;
    console.log("Task received:", task);

    const contract = getContractInstance();
    const tx = await contract.addTask(task);
    await tx.wait();

    res.status(200).json({ message: "Task added successfully" });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Change task status to finished
router.post('/changeStatus', async (req, res) => {
  try {
    const taskId = req.body.taskId;
    console.log("Task ID to finish:", taskId);

    const contract = getContractInstance();
    const tx = await contract.markAsFinished(taskId);
    await tx.wait();

    res.status(200).json({ message: "Task finished" });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
