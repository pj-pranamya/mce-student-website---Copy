import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Pages
import Home from './pages/Home';
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import StudyMaterialPage from "./pages/StudyMaterialPage";
import EventsPage from './pages/EventsPage';
import PlacementPage from "./pages/PlacementPage";
import MagazinePage from "./pages/MagazinePage";
import AccessDeniedPage from "./pages/AccessDeniedPage";

// Components
import StudentDashboard from "./components/StudentDashboard";
import ClubDashboard from "./components/ClubDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import FileUpload from './components/FileUpload'; // Import FileUpload component

// Placeholder Components for Manage Events and Manage Placements
import ManageEvents from "./components/ManageEvents";
import ManagePlacements from "./components/ManagePlacements";

// ProtectedRoute Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          setRole(userRole);
          localStorage.setItem("userRole", userRole);

          if (window.location.pathname === "/login") {
            if (userRole === "student") navigate("/student-dashboard");
            else if (userRole === "club_member") navigate("/club-dashboard");
            else if (userRole === "faculty") navigate("/faculty-dashboard");
          }
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem("userRole");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Authenticated Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/study-materials" element={<StudyMaterialPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/placement" element={<PlacementPage />} />
      <Route path="/magazine" element={<MagazinePage />} />

      {/* Upload Route */}
      <Route path="/upload" element={<FileUpload />} />

      {/* Protected Dashboards */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/club-dashboard"
        element={
          <ProtectedRoute allowedRoles={["club_member"]}>
            <ClubDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty-dashboard"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/manage-events" element={<ManageEvents />} />
      <Route path="/manage-placements" element={<ManagePlacements />} />

      {/* Access Denied Page */}
      <Route path="/access-denied" element={<AccessDeniedPage />} />

      {/* Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
