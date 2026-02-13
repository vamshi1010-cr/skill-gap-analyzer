const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());


let profiles = [];


app.post("/create-profile", (req, res) => {
  console.log("DATA RECEIVED:", req.body);
    
  const { name, email, year, courses, skills } = req.body;

 
  const normalizedSkills = typeof skills === "string" 
    ? skills.split(",").map(s => s.trim().toLowerCase()).filter(s => s) 
    : [];

  const newProfile = {
    id: Date.now(),
    name,
    email,
    year,
    courses,
    skills: normalizedSkills
  };

  profiles.push(newProfile);
  console.log("PROFILE SAVED:", newProfile);

  res.json({ message: "Profile created successfully", profile: newProfile });
});


app.get("/get-profile", (req, res) => {
  const lastProfile = profiles[profiles.length - 1];
  res.json(lastProfile || {});
});


app.get("/roles", (req, res) => {
  res.json([
    "Frontend Developer", 
    "Backend Developer", 
    "Full Stack Developer", 
    "Data Scientist",
    "DevOps Engineer"
  ]);
});

app.get("/suggest-role", (req, res) => {
  const lastProfile = profiles[profiles.length - 1];
  
  
  if (lastProfile && lastProfile.skills.includes("react")) {
      res.json({ suggestedRole: "Frontend Developer" });
  } else {
      res.json({ suggestedRole: "Backend Developer" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});