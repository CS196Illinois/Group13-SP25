import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import DatePicker from "./components/DatePicker";
import MyCalendar from "./components/MyCalendar";
import { gapi } from "gapi-script";
import "./App.css";
import TaskManager from "./components/TaskManager";

const CLIENT_ID =
  "961633912951-vncdmsf93iqnejrfps8q3svq8udtpv37.apps.googleusercontent.com";

function App() {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [lastFetchedRange, setLastFetchedRange] = useState(null);

  // Load GAPI script on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => initializeGapiClient();
    document.body.appendChild(script);
  }, []);

  const toggleTasks = () => setShowTasks(!showTasks);

  const initializeGapiClient = () => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: "https://www.googleapis.com/auth/calendar.readonly",
        })
        .then(() => {
          const authInstance = window.gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsSignedIn);
        })
        .catch((error) => {
          console.error("Error initializing GAPI client:", error);
        });
    });
  };

  const handleClick = (label) => {
    alert(`${label} clicked!`);
  };

  const handleAuthClick = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance
      .signIn()
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const handleLogoutClick = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signOut().then(() => {
      setIsSignedIn(false);
      setEvents([]);
    });
  };

  const handleDateClick = (arg) => {
    const title = prompt("New event title?");
    if (title) {
      setEvents([
        ...events,
        {
          title,
          start: arg.date,
          allDay: arg.allDay,
        },
      ]);
    }
  };

  const fetchEventsForRange = (start, end) => {
    gapi.client.load("calendar", "v3", () => {
      gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 100,
          orderBy: "startTime",
        })
        .then((response) => {
          const items = response.result.items || [];
          const mapped = items.map((event) => ({
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end?.dateTime || event.end?.date,
          }));
          setEvents(mapped);
        })
        .catch((error) => {
          console.error("Error fetching calendar events:", error);
        });
    });
  };
  
  const handleDatesSet = (dateInfo) => {
    if (isSignedIn) {
      setLastFetchedRange({ start: dateInfo.start, end: dateInfo.end });
      fetchEventsForRange(dateInfo.start, dateInfo.end);
    }
  };
  

  const addCalendarEvent = (newEvent) => {
    gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: {
        summary: newEvent.title,
        start: {
          dateTime: newEvent.start,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: newEvent.end,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        
      },
    })
      .then(() => {
        // Force re-fetch from Google to get the new event in the calendar
        if (lastFetchedRange) {
          fetchEventsForRange(lastFetchedRange.start, lastFetchedRange.end);
        }
      })
      .catch((error) => {
        console.error("Failed to add event to Google Calendar", error);
      });
  };
  
  
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", padding: "40px", minHeight: "100vh" }}>
        {/* Left panel */}
        <div style={{ width: "25%", minWidth: "300px" }}>
          <div style={{ padding: "20px" }}>
            <h2>Import</h2>
            <Button onClick={handleAuthClick}>Google Calendar</Button>
<Button onClick={handleLogoutClick}>Logout</Button>
<Button onClick={() => handleClick(".ics File")}>.ics File</Button>

          </div>

          <DatePicker />

          <div style={{ padding: "20px" }}>
            <h2>Export</h2>
            <Button onClick={() => handleClick("Export Google")}>
              Export Google
            </Button>
            <Button onClick={() => handleClick("Export .ics")}>
              Export .ics
            </Button>
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            flexGrow: 1,
            paddingLeft: "40px",
            display: "flex",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#13294B",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Enter your schedule
          </h1>

          <div
  style={{
    flexGrow: 1,
    position: "relative",
    overflowY: "scroll",
    backgroundColor: "white",
    paddingRight: "20px",
  }}
>

            {isSignedIn ? (
  <>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
      <Button onClick={toggleTasks}>Add Task</Button>
    </div>

    <MyCalendar
      events={events}
      handleDateClick={handleDateClick}
      handleDatesSet={handleDatesSet}
    />

{showTasks && (
  <TaskManager
    onClose={() => setShowTasks(false)}
    onAdd={addCalendarEvent}
  />
)}


  </>
) : (
  <Button onClick={handleAuthClick}>Connect Google Calendar</Button>
)}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
