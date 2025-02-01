import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedPercentage, setCompletedPercentage] = useState(0);

  useEffect(() => {
    const connectToMetamask = async () => {
      try {
        if (!window.ethereum) {
          console.log("Metamask not detected");
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Connected to account:", await signer.getAddress());

        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        const contractABI = process.env.REACT_APP_CONTRACTABI && JSON.parse(process.env.REACT_APP_CONTRACTABI);

        if (!contractAddress || !contractABI) {
          console.error("Contract address or ABI not provided");
          return;
        }

        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);

        const taskCount = await contractInstance.getAllTasks();
        setTasks(taskCount);
        console.log("Fetched tasks:", taskCount);

        const completedTasks = taskCount.filter((task) => task.status === 1);
        const percentage = taskCount.length ? (completedTasks.length / taskCount.length) * 100 : 0;
        setCompletedPercentage(percentage);
      } catch (err) {
        console.error("Error connecting to Metamask:", err);
      }
    };

    connectToMetamask();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!task.trim()) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/tasks`, {
        task: task,
      });

      console.log(response.data.message);
      setTask("");
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        process.env.REACT_APP_CONTRACTABI && JSON.parse(process.env.REACT_APP_CONTRACTABI),
        signer
      );

      const updatedTasks = await contractInstance.getAllTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleActions = async (taskId) => {
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/changeStatus`, {
        taskId: JSON.stringify(taskId),
      });
      console.log("Task status updated");

      await fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="container">
      <h1>Welcome to DtoDo Application</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add task here..."
          onChange={(e) => setTask(e.target.value)}
          value={task}
        />
        <input type="submit" value="Add task" />
      </form>

      <p>
        <strong>Completed Tasks Percentage: </strong>
        {Math.round(completedPercentage)}%
      </p>

      <table>
        <thead>
          <tr>
            <th>Task Id</th>
            <th>Task Description</th>
            <th>Task Status</th>
            <th>Task Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{task.desc || "No description"}</td>
              <td>{task.status === 0 ? "Pending" : "Finished"}</td>
              <td>
                {task.status === 0 ? (
                  <button onClick={() => handleActions(index)}>Mark as Finished</button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
