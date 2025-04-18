import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    "CS 124 Project meeting",
    "Dinner with Obama",
    "CS128 Homework"
  ]);
  const [newTask, setNewTask] = useState('');

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  return (
    <div className="w-96 p-4 bg-gradient-to-br from-gray-700 via-purple-600 to-blue-500 rounded-xl text-white space-y-4 shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Summary</h2>
        <Button variant="outline" className="text-xs bg-orange-500 text-white rounded px-2 py-1">Done/Edit</Button>
      </div>
      <ul className="space-y-1 max-h-28 overflow-y-scroll pr-1">
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-between items-center bg-white bg-opacity-10 p-2 rounded">
            {task}
            <button
              className="text-red-500 text-sm bg-white bg-opacity-20 rounded px-2"
              onClick={() => removeTask(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Task name"
        className="w-full p-2 rounded bg-white bg-opacity-20 placeholder-white text-white"
      />

      <div>
        <p className="mb-1">Urgency</p>
        <div className="flex gap-2">
          <Button className="bg-pink-600">Hot</Button>
          <Button className="bg-blue-400">Chill</Button>
          <Button className="bg-green-400">Anytime</Button>
        </div>
      </div>

      <div>
        <p className="mt-3 mb-1">Difficulty</p>
        <div className="flex gap-2">
          <Button className="bg-pink-700">Hard</Button>
          <Button className="bg-blue-500">Mid</Button>
          <Button className="bg-green-500">Easy</Button>
        </div>
      </div>

      <Button onClick={addTask} className="w-full bg-orange-500 hover:bg-orange-600">Add task</Button>
    </div>
  );
}

