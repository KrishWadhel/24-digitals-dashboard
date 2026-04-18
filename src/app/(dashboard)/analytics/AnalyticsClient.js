"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, Share2, Camera, Users, Lock, LogIn, FileText, Upload, TrendingUp, Zap, Search, Heart } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AnalyticsClient() {
  const { data: session } = useSession();
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then(res => res.json())
      .then(data => {
        setClients(data);
        if (data.length > 0) setSelectedClientId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetch(`/api/report/latest?clientId=${selectedClientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.found) setReport(data);
          else setReport(null);
        });
    }
  }, [selectedClientId]);

  if (loading) return <div style={{ padding: "5rem", textAlign: "center" }}>Initializing Insights Engine...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header with Client Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>Global Insights</h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Strategic data from your analyzed performance audits.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>VIEWING ENTITY:</p>
          <select 
            value={selectedClientId} 
            onChange={(e) => setSelectedClientId(e.target.value)}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 'bold', color: 'var(--text-primary)' }}
          >
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {!report ? (
        <div style={{ padding: '8rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
          <FileText size={48} style={{ margin: '0 auto 1.5rem auto', opacity: 0.2 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>No Strategic Data Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '300px', margin: '0.5rem auto' }}>
            To see analytics, please upload your PDF and Excel files in the Performance Report section.
          </p>
          <button 
            onClick={() => window.location.href = "/performance-report"}
            className="btn-primary" 
            style={{ marginTop: '2rem', padding: '1rem 2rem' }}
          >
            Go to Upload Hub
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Top Level Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            <div className="panel" style={{ borderLeft: '6px solid #ec4899' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 'bold' }}>TOTAL REACH</p>
                <TrendingUp size={16} color="#ec4899" />
              </div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0.5rem 0" }}>{report.data.totals.reach.toLocaleString()}</h2>
              <span style={{ color: "#10b981", fontSize: "0.75rem", fontWeight: 'bold' }}>EXTRACTED FROM AUDIT</span>
            </div>
            <div className="panel" style={{ borderLeft: '6px solid #3b82f6' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 'bold' }}>TOTAL VIEWS</p>
                <Zap size={16} color="#3b82f6" />
              </div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0.5rem 0" }}>{report.data.totals.views.toLocaleString()}</h2>
              <span style={{ color: "#10b981", fontSize: "0.75rem", fontWeight: 'bold' }}>AGGREGATED MONTHLY</span>
            </div>
            <div className="panel" style={{ borderLeft: '6px solid #8b5cf6' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 'bold' }}>TOTAL INTERACTIONS</p>
                <Heart size={16} color="#8b5cf6" />
              </div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0.5rem 0" }}>{report.data.totals.interactions.toLocaleString()}</h2>
              <span style={{ fontSize: "0.75rem", color: 'var(--text-secondary)' }}>LIKES + SAVES + SHARES + CMTS</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
            {/* Top Posts Table */}
            <div className="panel">
              <h3 style={{ marginBottom: "1.5rem", fontWeight: "900", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={20} color="#ec4899" /> Individual Content Drill-down
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>VIEWS</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>LIKES</th>
                      <th style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>INTERACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.posts.slice(0, 10).map((post, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: '700' }}>#{idx + 1}</td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '900' }}>{post.views.toLocaleString()}</td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{post.likes.toLocaleString()}</td>
                        <td style={{ padding: '1rem' }}>
                           <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(236,72,153,0.1)', color: '#ec4899', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '900' }}>
                            {post.interactions.toLocaleString()}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Summary from PDF */}
            <div className="panel" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
               <h3 style={{ marginBottom: "1rem", fontWeight: "900" }}>Strategic Summary</h3>
               <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                 {report.report.overviewText ? report.report.overviewText.slice(0, 500) + "..." : "No PDF abstract available for this period."}
               </p>
               <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold' }}>AUDIT PERIOD</p>
                  <p style={{ margin: 0, fontWeight: '900', color: '#ec4899' }}>{report.report.period}</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
