require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Profile = require("./models/Profile");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- ROUTES ---

// 1. Create Profile
app.post("/create-profile", async (req, res) => {
  try {
    const { name, email, year, courses, skills } = req.body;
    const normalizedSkills = typeof skills === "string" 
      ? skills.split(",").map(s => s.trim().toLowerCase()).filter(s => s) 
      : [];

    const newProfile = new Profile({
      name, email, year, courses,
      skills: normalizedSkills
    });

    await newProfile.save();
    res.json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res.status(500).json({ error: "Failed to save profile" });
  }
});

// 2. Get the latest profile
app.get("/get-profile", async (req, res) => {
  try {
    const lastProfile = await Profile.findOne().sort({ createdAt: -1 });
    res.json(lastProfile || {});
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// 3. Static Roles List
app.get("/roles", (req, res) => {
  res.json([
    "Frontend Developer", "Backend Developer", 
    "Full Stack Developer", "Data Scientist", "DevOps Engineer"
  ]);
});

// 4. AI Role Suggestion
app.get("/suggest-role", async (req, res) => {
  try {
    const lastProfile = await Profile.findOne().sort({ createdAt: -1 });
    if (!lastProfile) return res.json({ suggestedRole: "Please create a profile first" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Based on these skills: ${lastProfile.skills.join(", ")} and courses: ${lastProfile.courses}, suggest the best single job role from this list: [Frontend Developer, Backend Developer, Full Stack Developer, Data Scientist, DevOps Engineer]. Return only the role name.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ suggestedRole: response.text().trim() });
  } catch (error) {
    res.status(500).json({ suggestedRole: "AI Suggestion Unavailable" });
  }
});

// 5. NEW: AI Skill Gap Analyzer & Roadmap Generator
app.post("/generate-roadmap", async (req, res) => {
  try {
    const { role } = req.body;
    const lastProfile = await Profile.findOne().sort({ createdAt: -1 });

    if (!lastProfile) return res.status(404).json({ error: "No profile found" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Act as a Career Mentor. Analyze this student for the role of ${role}.
      Student Skills: ${lastProfile.skills.join(", ")}
      Student Courses: ${lastProfile.courses}

      Provide a JSON response with:
      1. "readinessScore": (0-100)
      2. "missingSkills": [List specific skills they don't have for this role]
      3. "weakSkills": [List skills they have but need to improve]
      4. "roadmap": [List 3-4 steps to get job-ready, with "task" and "resource"]

      Return ONLY pure JSON. No markdown blocks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up AI output if it includes markdown code blocks
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Roadmap Error:", error);
    res.status(500).json({ error: "Failed to generate AI Roadmap" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});