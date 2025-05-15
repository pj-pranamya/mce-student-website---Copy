import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import "../styles/eventsPage.css";

const AddEventForm = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        title,
        date,
        type,
        description,
        createdBy: "faculty",
        createdById: user.uid,
        timestamp: new Date()
      });
      setSuccessMessage("✅ Event added successfully!");
      setTitle("");
      setDate("");
      setType("");
      setDescription("");
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Error adding event.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="events-container">
        <h2>➕ Add New Event</h2>
        <form onSubmit={handleSubmit} className="event-form">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Event Type (e.g., Workshop, Fest)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Add Event</button>
        </form>
        {successMessage && <p className="success-msg">{successMessage}</p>}
      </div>
    </>
  );
};

export default AddEventForm;
