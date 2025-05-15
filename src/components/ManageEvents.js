import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: '',
    description: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddOrUpdateEvent = async (e) => {
    e.preventDefault();

    if (editingEvent) {
      try {
        const eventRef = doc(db, 'events', editingEvent.id);
        await updateDoc(eventRef, {
          ...newEvent,
          date: new Date(newEvent.date),
        });
        if (userRole === 'faculty' || userRole === 'admin') {
          setSuccessMessage('✅ Event updated successfully!');
        }
      } catch (error) {
        console.error('Error updating event: ', error);
      }
    } else {
      try {
        await addDoc(collection(db, 'events'), {
          title: newEvent.title,
          date: new Date(newEvent.date),
          type: newEvent.type,
          description: newEvent.description,
          facultyId: auth.currentUser?.uid || 'unknown',
          createdAt: serverTimestamp(),
        });
        if (userRole === 'faculty' || userRole === 'admin') {
          setSuccessMessage('✅ Event added successfully!');
        }
      } catch (error) {
        console.error('Error adding event: ', error);
      }
    }

    setNewEvent({ title: '', date: '', type: '', description: '' });
    setEditingEvent(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      date: new Date(event.date.seconds * 1000).toISOString().slice(0, 16),
      type: event.type,
      description: event.description,
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Part - Event List */}
      <div className="lg:col-span-8 bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📋 Uploaded Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md border">
              <h4 className="font-bold text-lg">{event.title}</h4>
              <p><strong>Date:</strong> {new Date(event.date.seconds * 1000).toLocaleString()}</p>
              <p><strong>Type:</strong> {event.type}</p>
              <p>{event.description}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEditClick(event)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Part - Event Form */}
      <div className="lg:col-span-4 bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleAddOrUpdateEvent}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Event Title</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border rounded"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Event Date</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full p-2 border rounded"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Event Type</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border rounded"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Event Description</label>
            <textarea
              className="mt-1 block w-full p-2 border rounded"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingEvent ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>

        {successMessage && (
          <p className="text-green-500 text-sm mt-4">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
