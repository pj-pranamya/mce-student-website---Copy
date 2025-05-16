import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const ManagePlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [newPlacement, setNewPlacement] = useState({
    companyName: '',
    role: '',
    eligibility: '',
    lastDate: '',
    applyLink: '',
  });

  const fetchPlacements = async () => {
    const querySnapshot = await getDocs(collection(db, 'placements'));
    const placementsList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setPlacements(placementsList);
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleAddPlacement = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'placements'), newPlacement);
      setNewPlacement({
        companyName: '',
        role: '',
        eligibility: '',
        lastDate: '',
        applyLink: '',
      });
      fetchPlacements(); // refresh list
    } catch (error) {
      console.error('Error adding placement: ', error);
    }
  };

  const handleDeletePlacement = async (id) => {
    try {
      await deleteDoc(doc(db, 'placements', id));
      fetchPlacements(); // refresh list
    } catch (error) {
      console.error('Error deleting placement: ', error);
    }
  };

  return (
    <div className="manage-placements-container">
      <h2>📋 Manage Placements</h2>

      <form onSubmit={handleAddPlacement}>
        <input
          type="text"
          placeholder="Company Name"
          value={newPlacement.companyName}
          onChange={(e) => setNewPlacement({ ...newPlacement, companyName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Role"
          value={newPlacement.role}
          onChange={(e) => setNewPlacement({ ...newPlacement, role: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Eligibility"
          value={newPlacement.eligibility}
          onChange={(e) => setNewPlacement({ ...newPlacement, eligibility: e.target.value })}
        />
        <input
          type="date"
          value={newPlacement.lastDate}
          onChange={(e) => setNewPlacement({ ...newPlacement, lastDate: e.target.value })}
        />
        <input
          type="url"
          placeholder="Apply Link"
          value={newPlacement.applyLink}
          onChange={(e) => setNewPlacement({ ...newPlacement, applyLink: e.target.value })}
        />
        <button type="submit">Add Placement</button>
      </form>

      <div className="placements-list">
        {placements.map((placement) => (
          <div key={placement.id} className="placement-card">
            <h3>{placement.companyName}</h3>
            <p><strong>Role:</strong> {placement.role}</p>
            <p><strong>Eligibility:</strong> {placement.eligibility}</p>
            <p><strong>Last Date:</strong> {placement.lastDate}</p>
            <a href={placement.applyLink} target="_blank" rel="noopener noreferrer">Apply</a>
            <br />
            <button onClick={() => handleDeletePlacement(placement.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePlacements;
