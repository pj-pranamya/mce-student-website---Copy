import React, { useState, useEffect } from "react";
import "../styles/eventsPage.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    // Fetching event data (dummy for now)
    const fetchEvents = () => {
      const dummyEvents = [
        {
          id: 1,
          title: "Tech Fest 2025",
          date: "2025-04-25",
          type: "Fest",
          description: "A celebration of technology and innovation.",
        },
        {
          id: 2,
          title: "Workshop on AI",
          date: "2025-05-01",
          type: "Workshop",
          description: "Hands-on workshop on Artificial Intelligence.",
        },
        // Add more events as needed
      ];
      setEvents(dummyEvents);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filterEvents = () => {
      setFilteredEvents(
        events.filter(
          (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    };
    filterEvents();
  }, [searchQuery, events]);

  return (
    <div className="events-container">
      <h2>🎉 College Events</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="events-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Type:</strong> {event.type}</p>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p className="no-events">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
