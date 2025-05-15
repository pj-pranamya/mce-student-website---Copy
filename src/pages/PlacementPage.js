import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";

const PlacementPage = () => {
  const [placementData, setPlacementData] = useState([]);

  useEffect(() => {
    const fetchPlacementData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "placements"));
        const placements = [];
        querySnapshot.forEach((doc) => {
          placements.push({ id: doc.id, ...doc.data() });
        });
        setPlacementData(placements);
      } catch (error) {
        console.error("Error fetching placement data:", error);
      }
    };

    fetchPlacementData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="placement-container">
        <h2>💼 Placement Opportunities</h2>

        <div className="placement-list">
          {placementData.length > 0 ? (
            placementData.map((placement) => (
              <div key={placement.id} className="placement-card">
                <h3>{placement.companyName}</h3>
                <p><strong>Role:</strong> {placement.role}</p>
                <p><strong>Eligibility:</strong> {placement.eligibility}</p>
                <p><strong>Last Date:</strong> {placement.lastDate}</p>
                <a href={placement.applyLink} target="_blank" rel="noopener noreferrer" className="apply-btn">Apply Now</a>
              </div>
            ))
          ) : (
            <p className="no-results">No placements available at the moment.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PlacementPage;
