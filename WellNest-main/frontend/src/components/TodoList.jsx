import React, { useEffect, useState } from "react";
import axios from "axios";

const TodoList = () => {
  const [tasks, setTasks] = useState(null);
  const [lastAction, setLastAction] = useState(null); // Stores last action for undo

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://wellnest-5zry.onrender.com/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckboxChange = async (taskId, taskIndex, completed) => {
    try {
      const updatedTasks = [...tasks.tasks]; // Create a copy
      updatedTasks[taskIndex].completed = completed; // Update completion status

      // Send update request to the backend
      await axios.put(`https://wellnest-5zry.onrender.com/api/tasks/${taskId}`, {
        taskIndex,
        completed,
      });

      // Store last action for undo
      setLastAction({ taskId, taskIndex, previousState: !completed });
      console.log("Last action stored:", { taskId, taskIndex, previousState: !completed });

      // Update state with new tasks
      setTasks({ ...tasks, tasks: updatedTasks });
    } catch (err) {
      console.error(err);
    }
  };

  const undoLastAction = async () => {
    if (!lastAction) return;

    try {
      const { taskId, taskIndex, previousState } = lastAction;
      console.log("Undo action:", lastAction);

      // Toggle task back to previous state
      await axios.put(`https://wellnest-5zry.onrender.com/api/tasks/${taskId}`, {
        taskIndex,
        completed: previousState, // Revert to previous state
      });

      // Update state
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks.tasks];
        updatedTasks[taskIndex].completed = previousState;
        return { ...prevTasks, tasks: updatedTasks };
      });

      setLastAction(null); // Clear undo action after execution
    } catch (err) {
      console.error(err);
    }
  };

  if (!tasks) return <div className="text-center text-gray-500 mt-4">Loading...</div>;

  return (
    <div className="w-full mx-auto p-6  bg-cover">
      <div className="w-[60vw] m-auto mt-26">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl sm:text-6xl font-semibold text-gray-800 w-full text-center">Mental Health To-Do List</h1>
          {lastAction && (
            <button
              onClick={undoLastAction}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Undo
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <span className="text-sm text-gray-600">Completion: {tasks.completionPercentage}%</span>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-[#29b5f6] h-2 rounded-full transition-all"
              style={{ width: `${tasks.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-2 gap-4">
          {tasks.tasks.map((task, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg shadow-md transition-all cursor-pointer ${
                task.completed ? "bg-gray-200 text-gray-500" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleCheckboxChange(tasks._id, index, !task.completed)}
            >
              <input
                type="checkbox"
                checked={task.completed}
                readOnly
                className="w-5 h-5 mr-3 accent-[#29b5f6] cursor-pointer"
              />
              <span>{task.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;