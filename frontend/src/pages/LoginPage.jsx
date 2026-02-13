import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [courses, setCourses] = useState("");
  const [skills, setSkills] = useState("");

const handleSubmit = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/create-profile",
      {
        name,
        email,
        year,
        courses,
        skills
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("SUCCESS:", response.data);
    navigate("/roles");

  } catch (error) {
    console.error("FULL ERROR:", error);
    alert("Backend not connected. Moving forward anyway.");
    navigate("/roles");
  }
};


  return (
    <div style={{ padding: "40px" }}>
      <h1>Student Profile Login</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Gmail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        placeholder="Year of Study"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      /><br /><br />

      <input
        placeholder="Courses / Certifications"
        value={courses}
        onChange={(e) => setCourses(e.target.value)}
      /><br /><br />

      <input
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      /><br /><br />

      <button onClick={handleSubmit}>Continue</button>
    </div>
  );
}

export default LoginPage;
