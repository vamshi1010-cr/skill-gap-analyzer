import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RolesPage from "./pages/RolesPage";
import Dashboard from "./pages/Dashboard"; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;