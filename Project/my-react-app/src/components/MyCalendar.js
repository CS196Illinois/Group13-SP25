import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function MyCalendar({ events, handleDateClick, handleDatesSet }) {
  return (
    <FullCalendar
      headerToolbar={{
        left: "prev,next today",
        center: "",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
      initialView="timeGridWeek"
      editable={true}
      selectable={true}
      events={events}
      expandRows={true}
      dateClick={handleDateClick}
      datesSet={handleDatesSet}
    />
  );
}

export default MyCalendar;
