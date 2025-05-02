import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function DatePicker() {
  const [selected, setSelected] = useState();

  return (
    <div style={{ marginLeft: "20px", marginTop: "5px" }}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        styles={{
          caption_label: { fontSize: "1.2rem", fontWeight: "bold" },
          day_selected: { backgroundColor: "#FF5F05", color: "white" },
        }}
      />
      <p style={{ marginTop: "10px" }}>
        {selected
          ? `Selected: ${selected.toLocaleDateString()}`
          : "Pick a day."}
      </p>
    </div>
  );
}

export default DatePicker;
