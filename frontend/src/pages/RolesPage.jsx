import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RolePage() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [suggestedRole, setSuggestedRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
    axios.get("http://localhost:5000/roles")
      .then(res => setRoles(res.data))
      .catch(err => console.error(err));
  }, []);

  const getSuggestion = async () => {
    try {
        const res = await axios.get("http://localhost:5000/suggest-role");
        setSuggestedRole(res.data.suggestedRole);
    } catch (error) {
        console.error("Error fetching suggestion", error);
    }
  };

  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Select Your Target Role</h1>

      <button onClick={getSuggestion}>Get Suggested Role</button>
      
      {suggestedRole && (
        <p style={{marginTop: '10px', color: 'green'}}>
            <strong>AI Suggestion:</strong> {suggestedRole}
        </p>
      )}

      <br /><br />

      <select 
        onChange={(e) => setSelectedRole(e.target.value)}
        style={{ padding: "10px", fontSize: "16px" }}
      >
        <option value="">-- Search & Select Role --</option>
        {roles.map((role, index) => (
          <option key={index} value={role}>{role}</option>
        ))}
      </select>

      <br /><br />

      <button onClick={handleContinue} className="button" style={{width: '200px'}}>
        Continue
      </button>
    </div>
  );
}

export default RolePage;