import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/get-profile")
      .then(res => setProfile(res.data));
  }, []);

  if (!profile) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Profile Dashboard</h1>

      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Year:</strong> {profile.year}</p>
      <p><strong>Courses:</strong> {profile.courses}</p>
      <p><strong>Skills:</strong> {profile.skills?.join(", ")}</p>
    </div>
  );
}

export default Dashboard;
