import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const FacultyDashboard = () => {
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

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Faculty Dashboard 🎓</h1>
        <div className="dashboard-userinfo">
          <h3>Name: {userData.name}</h3>
          <h3>Email: {userData.email}</h3>
          <h3>Role: {userData.role}</h3>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => navigate("/manage-events")}>
            <h3>📅 Manage Events</h3>
            <p>Organize and update college events and fests.</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate("/manage-placements")}>
            <h3>📄 Manage Placements</h3>
            <p>Update placement opportunities and student progress.</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate("/study-materials")}>
            <h3>📚 Upload Study Materials</h3>
            <p>Upload, approve, and manage study materials for students.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
