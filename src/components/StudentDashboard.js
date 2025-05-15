import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";  // Ensure this is included

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchData();
  }, []);

  if (!userData) return <p className="dashboard-loading">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">🎓 Student Dashboard</h1>

        <div className="dashboard-userinfo">
          <h3>👤 Name: {userData.name}</h3>
          <h3>📧 Email: {userData.email}</h3>
          <h3>🎭 Role: {userData.role}</h3>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => navigate("/study-materials")}>
            <h3>📚 Study Materials</h3>
          </div>
          <div className="dashboard-card" onClick={() => navigate("/events")}>
            <h3>🎉 Events</h3>
          </div>
          <div className="dashboard-card" onClick={() => navigate("/placement")}>
            <h3>💼 Placements</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
