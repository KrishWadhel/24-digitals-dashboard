"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div className="panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--accent-blue)' }}>24</span> Digitals
        </h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@24digitals.com"
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <p style={{ marginBottom: "0.5rem" }}>Demo Accounts (Password: admin123)</p>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li>admin@24digitals.com (Admin)</li>
            <li>yashvi@24digitals.com (Employee)</li>
            <li>vigo@client.com (PW: client123)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
