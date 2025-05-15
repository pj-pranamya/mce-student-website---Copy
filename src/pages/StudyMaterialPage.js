import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore"; // ⬅️ Keep this for fetching data
import { getAuth } from "firebase/auth";

const StudyMaterialPage = () => {
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch uploaded files from Firestore
  const fetchUploadedFiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "study-materials"));
      const files = querySnapshot.docs.map((doc) => doc.data());
      setUploadedFiles(files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles(); // Load files on page load
  }, []);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !branch || !year || !subject || !file) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Prepare data to be sent to the backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("branch", branch);
      formData.append("year", year);
      formData.append("subject", subject);
      formData.append("uploader", user ? user.uid : "anonymous");
      formData.append("uploaderRole", user ? "student" : "anonymous");

      // Send the form data to the backend to upload the file
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("File URL:", data.fileUrl);

      // If response is not OK, show error
      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      // Clear form and reload files
      setTitle("");
      setBranch("");
      setYear("");
      setSubject("");
      setFile(null);

      // Reload uploaded files from Firestore
      fetchUploadedFiles();

      alert("Study material uploaded successfully!");
    } catch (error) {
      alert("Upload error: " + error.message);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>📚 Upload Study Material</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Material Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="text"
          placeholder="Branch (e.g., CSE)"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="text"
          placeholder="Year (e.g., 2nd Year)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ marginBottom: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Upload
        </button>
      </form>

      <div style={{ marginTop: "3rem" }}>
        <h3>📄 Uploaded Files</h3>
        {uploadedFiles.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index} style={{ marginBottom: "0.8rem" }}>
                <strong>{file.title}</strong> ({file.subject}) - {file.branch}, {file.year}
                <br />
                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                  View
                </a>{" "}
                |{" "}
                <a href={file.fileUrl} download>
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialPage;
