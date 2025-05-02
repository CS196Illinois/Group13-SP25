import React, { useState } from "react";

export default function TaskManager({ onClose, onAdd }) {
  const [task, setTask] = useState("");
  const [urgency, setUrgency] = useState("Anytime");
  const [difficulty, setDifficulty] = useState("Easy");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // yyyy-mm-dd
  const [time, setTime] = useState("09:00"); // default to 9:00 AM

  const handleAdd = () => {
    if (!task.trim()) return;

    const startDateTime = new Date(`${date}T${time}:00`);
    const newEvent = {
      title: `${task} (${urgency}, ${difficulty})`,
      start: startDateTime.toISOString(),
      allDay: false,
    };

    onAdd(newEvent);
    setTask("");
    onClose();
  };

  return (
    <>
      <div style={backdropStyle} onClick={onClose} />

      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2>Add Task</h2>

        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Task name"
          style={inputStyle}
        />

        <label>Select date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <label>Select time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={inputStyle}
        />

        <label>Urgency</label>
        <div style={buttonGroupStyle}>
          {["Hot", "Chill", "Anytime"].map((level) => (
            <button
              key={level}
              style={{
                ...chipStyle,
                backgroundColor: urgency === level ? "#FF5F05" : "#eee",
              }}
              onClick={() => setUrgency(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <label>Difficulty</label>
        <div style={buttonGroupStyle}>
          {["Hard", "Mid", "Easy"].map((level) => (
            <button
              key={level}
              style={{
                ...chipStyle,
                backgroundColor: difficulty === level ? "#007BFF" : "#eee",
              }}
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button onClick={handleAdd} style={addButtonStyle}>
            Add to Calendar
          </button>
        </div>
      </div>
    </>
  );
}

// Styles
const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.3)",
  zIndex: 9,
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  zIndex: 10,
  minWidth: "300px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonGroupStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "10px",
};

const chipStyle = {
  padding: "6px 12px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
};

const addButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
