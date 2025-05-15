// src/components/ManagePlacements.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const ManagePlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [newPlacement, setNewPlacement] = useState({
    companyName: '',
    jobTitle: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    const fetchPlacements = async () => {
      const querySnapshot = await getDocs(collection(db, 'placements'));
      const placementsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPlacements(placementsList);
    };

    fetchPlacements();
  }, []);

  const handleAddPlacement = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'placements'), newPlacement);
      setNewPlacement({ companyName: '', jobTitle: '', date: '', description: '' }); // Reset form
    } catch (error) {
      console.error('Error adding placement: ', error);
    }
  };

  const handleDeletePlacement = async (id) => {
    try {
      await deleteDoc(doc(db, 'placements', id));
    } catch (error) {
      console.error('Error deleting placement: ', error);
    }
  };

  return (
    <div className="manage-placements-container">
      <h2>Manage Placements</h2>

      <form onSubmit={handleAddPlacement}>
        <input
          type="text"
          placeholder="Company Name"
          value={newPlacement.companyName}
          onChange={(e) => setNewPlacement({ ...newPlacement, companyName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Job Title"
          value={newPlacement.jobTitle}
          onChange={(e) => setNewPlacement({ ...newPlacement, jobTitle: e.target.value })}
        />
        <input
          type="date"
          value={newPlacement.date}
          onChange={(e) => setNewPlacement({ ...newPlacement, date: e.target.value })}
        />
        <textarea
          placeholder="Job Description"
          value={newPlacement.description}
          onChange={(e) => setNewPlacement({ ...newPlacement, description: e.target.value })}
        />
        <button type="submit">Add Placement</button>
      </form>

      <div className="placements-list">
        {placements.map((placement) => (
          <div key={placement.id} className="placement-card">
            <h3>{placement.companyName}</h3>
            <p><strong>Job Title:</strong> {placement.jobTitle}</p>
            <p><strong>Date:</strong> {placement.date}</p>
            <p>{placement.description}</p>
            <button onClick={() => handleDeletePlacement(placement.id)}>Delete Placement</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePlacements;
