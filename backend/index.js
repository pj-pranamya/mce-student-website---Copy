const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");
const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin
const firebaseServiceAccount = require("./firebase-service.json");
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
});
const db = admin.firestore();

// Google Drive Auth
const KEYFILEPATH = path.join(__dirname, "drive-service.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup
const upload = multer({ dest: "uploads/" });

// Route: Upload Study Material
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, branch, year, subject, uploader, uploaderRole } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Upload to Google Drive
    const fileMetadata = { name: file.originalname };
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = response.data.id;

    // Make file public
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Get public URL
    const fileUrl = `https://drive.google.com/uc?id=${fileId}&export=view`;

    // Save metadata to Firestore (collection name must match frontend)
    await db.collection("study-materials").add({
      title,
      branch,
      year,
      subject,
      uploader,
      uploaderRole,
      fileUrl,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Cleanup temp file
    fs.unlinkSync(file.path);

    res.status(200).json({ message: "Study material uploaded successfully!", fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
