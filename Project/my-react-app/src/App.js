import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import DatePicker from "./components/DatePicker";
import MyCalendar from "./components/MyCalendar";
import { gapi } from "gapi-script";
import "./App.css";

const CLIENT_ID =
  "961633912951-vncdmsf93iqnejrfps8q3svq8udtpv37.apps.googleusercontent.com";

function App() {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const initializeGapiClient = () => {
      window.gapi.load("client:auth2", () => {
        window.gapi.client
          .init({
            clientId: CLIENT_ID,
            scope: "https://www.googleapis.com/auth/calendar",
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

    if (window.gapi) {
      initializeGapiClient();
    } else {
      console.error("GAPI script not loaded");
    }
  }, []);

  const handleClick = (label) => {
    alert(`${label} clicked!`);
  };

  const handleAuthClick = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance
      .signIn()
      .then(() => {
        listUpcomingEvents();
      })
      .catch((error) => {
        console.error("Error signing in:", error);
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

  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
      })
      .then((response) => {
        const events = response.result.items || [];
        const mappedEvents = events.map((event) => ({
          title: event.summary,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
        }));
        setEvents(mappedEvents);
      });
  };

  return (
    <div>
      <Navbar />

      {/* Whole page content */}
      <div style={{ display: "flex", padding: "40px", minHeight: "100vh" }}>
        {/* LEFT side: Import / DatePicker / Export */}
        <div style={{ width: "25%", minWidth: "300px" }}>
          {/* Import section */}
          <div style={{ padding: "20px" }}>
            <h2>Import</h2>
            <Button onClick={() => handleClick("Google Calendar")}>
              Google Calendar
            </Button>
            <Button onClick={() => handleClick(".ics File")}>.ics File</Button>
          </div>

          {/* DatePicker */}
          <DatePicker />

          {/* Export section */}
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

        {/* RIGHT side: Title + Calendar */}
        <div
          style={{
            flexGrow: 1,
            paddingLeft: "40px",
            display: "flex",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          {/* Title */}
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

          {/* Scrollable Calendar Box */}
          <div
            style={{
              flexGrow: 1,
              overflowY: "scroll",
              backgroundColor: "white",
              paddingRight: "20px",
            }}
          >
            {isSignedIn ? (
              <MyCalendar events={events} handleDateClick={handleDateClick} />
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
