import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError("User data not found.");
          }
        } else {
          setError("No user is logged in.");
        }
      } catch (err) {
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const goBackToDashboard = () => {
    if (!userData?.role) return;
    if (userData.role === "student") navigate("/student-dashboard");
    else if (userData.role === "club_member") navigate("/club-dashboard");
    else if (userData.role === "faculty") navigate("/faculty-dashboard");
    else navigate("/");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>My Profile 👤</h1>
        <h3>Name: {userData.name}</h3>
        <h3>Email: {userData.email}</h3>
        <h3>Role: {userData.role}</h3>

        <button onClick={goBackToDashboard} style={{ marginTop: "20px" }}>
          🔙 Back to Dashboard
        </button>
      </div>
    </>
  );
};

export default Profile;
