"use client";

import { useEffect, useState } from "react";
import { Download, Upload, Moon, Sun, Key } from "lucide-react";
import { saveSettings, getSettings } from "./actions";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark"); // Default dark
  const [apiKeys, setApiKeys] = useState({ facebook: "", instagram: "", igBusinessId: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      setApiKeys({
        facebook: data.facebookSecret || "",
        instagram: data.instagramToken || "",
        igBusinessId: data.igBusinessId || ""
      });
    }
    load();
  }, []);
  
  const handleDownloadReport = () => {
    window.location.href = "/api/worklogs";
  };

  const handleSaveKeys = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("facebookSecret", apiKeys.facebook);
    formData.append("instagramToken", apiKeys.instagram);
    formData.append("igBusinessId", apiKeys.igBusinessId);
    
    const res = await saveSettings(formData);
    setLoading(false);
    
    if (res.success) {
      alert("API Keys saved securely to database!");
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Settings</h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage your application preferences and integrations</p>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        

        <div className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Weekly Work Report</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Download a CSV report of all logged tasks formatted for accounting.
            </p>
          </div>
          <button className="btn-primary" onClick={handleDownloadReport} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Download size={18} /> Download CSV
          </button>
        </div>

        <div className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Interface Theme</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Current theme is {theme === "dark" ? "Dark Theme" : "Light Theme"}.
            </p>
          </div>
          <button 
            className="btn-secondary" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} 
            Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
}
