import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

function MyCalendar({ events, handleDateClick }) {
  return (
    <FullCalendar
      headerToolbar={{
        left: "prev,next today",
        center: "",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="timeGridWeek"
      editable={true}
      selectable={true}
      events={events}
      expandRows={true}
      dateClick={handleDateClick}
    />
  );
}

export default MyCalendar;
