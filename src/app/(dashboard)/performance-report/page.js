"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download, Camera, TrendingUp, Users, Share2, CheckCircle, Target, ArrowRight, Smartphone, BarChart2 } from "lucide-react";
import { formatDate } from "@/lib/format";

const DonutChart = ({ value, label, total = 100 }) => {
  const percentage = Math.min(100, Math.max(0, (value / total) * 100));
  const chartData = [{ value: percentage }, { value: 100 - percentage }];
  return (
    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} innerRadius={35} outerRadius={45} paddingAngle={0} dataKey="value" startAngle={90} endAngle={450}>
            <Cell fill="#a855f7" stroke="none" />
            <Cell fill="rgba(0,0,0,0.05)" stroke="none" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <p style={{ fontSize: '1rem', fontWeight: '900', margin: 0, color: '#000000' }}>{value}</p>
        <p style={{ fontSize: '0.4rem', color: '#666666', textTransform: 'uppercase', margin: 0, fontWeight: '700' }}>{label}</p>
      </div>
    </div>
  );
};

const ReportSegment = ({ client, instagramData }) => {
  const totalTarget = client.targets.posts + client.targets.reels + client.targets.carousels;
  const totalActual = client.actual.posts + client.actual.reels + client.actual.carousels;
  const progress = totalTarget === 0 ? 0 : Math.round((totalActual / totalTarget) * 100);

  // Prepare Instagram data for charts
  const igMedia = instagramData?.media || [];

  return (
    <div className="report-page" style={{ padding: '3rem', background: '#ffffff', color: '#000000' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', borderBottom: '2px solid #000', paddingBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px', color: '#000' }}>Performance Audit</h1>
          <p style={{ fontSize: '1rem', color: '#a855f7', fontWeight: '800', textTransform: 'uppercase', marginTop: '0.5rem' }}>{client.name} • April 2026</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.75rem', fontWeight: 'Bold', marginBottom: '0.5rem' }}>
            <TrendingUp size={14} /> 24 DIGITALS ENGINE
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700' }}>ID: {client.id.toUpperCase()}</p>
        </div>
      </div>

      {/* Summary Scorecard (RESTORED) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ padding: '2rem', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: '120px', minWidth: '120px', height: '120px', borderRadius: '50%', border: '8px solid #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0, color: '#000' }}>{progress}%</h2>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#000' }}>Monthly Completion</h3>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>Current progress across all scheduled platforms and content types.</p>
          </div>
        </div>
        <div style={{ padding: '2rem', background: '#000', borderRadius: '32px', color: '#fff' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase', marginBottom: '1rem' }}>Snapshot</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Target Items</span>
            <span style={{ fontWeight: '900' }}>{totalTarget}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Actual Done</span>
            <span style={{ fontWeight: '900', color: '#4ade80' }}>{totalActual}</span>
          </div>
        </div>
      </div>

      {/* Target breakdown (RESTORED) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '24px', textAlign: 'center', background: '#ffffff' }}>
          <DonutChart value={client.actual.posts} label="POSTS" total={client.targets.posts || 1} />
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: '800' }}>{client.actual.posts} / {client.targets.posts}</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '24px', textAlign: 'center', background: '#ffffff' }}>
          <DonutChart value={client.actual.reels} label="REELS" total={client.targets.reels || 1} />
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: '800' }}>{client.actual.reels} / {client.targets.reels}</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '24px', textAlign: 'center', background: '#ffffff' }}>
          <DonutChart value={client.actual.carousels} label="CAROUSELS" total={client.targets.carousels || 1} />
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: '800' }}>{client.actual.carousels} / {client.targets.carousels}</p>
        </div>
      </div>

      {/* Detailed Post Log */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '1.5rem', color: '#000' }}>Detailed Post Report</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#000', color: '#fff' }}>
            <th style={{ padding: '1rem', textAlign: 'left' }}>DATE</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>TYPE</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>DESCRIPTION</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>ASSIGNEE</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>REACH</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>INTERACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {client.tasks.map((task, idx) => {
            const reach = task.reach || 0;
            const interactions = task.interactions || 0;

            return (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{formatDate(task.dueDate)}</td>
                <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: '#f5f5f5', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.65rem', color: '#000', fontWeight: 'bold' }}>{task.title}</span></td>
                <td style={{ padding: '1rem' }}>{task.description}</td>
                <td style={{ padding: '1rem', color: '#666', fontWeight: 'bold' }}>@{task.assigneeName || 'unassigned'}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>{reach.toLocaleString()}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>{interactions.toLocaleString()}</td>
              </tr>
            )
          })}
          {client.tasks.length === 0 && (
            <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>No post records found for this period.</td></tr>
          )}
        </tbody>
      </table>

      {/* Live Instagram Insights (NEW) */}
      <div style={{ marginTop: '4rem', pageBreakBefore: 'always' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem', color: '#000', borderBottom: '2px solid #a855f7', display: 'inline-block' }}>Live Instagram Enagement Insights</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
          {igMedia.map((media, idx) => (
            <div key={idx} style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '24px', background: '#fff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '150px', height: '150px', borderRadius: '16px', overflow: 'hidden', background: '#f5f5f5' }}>
                  <img src={media.media_url} alt="ig-post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '900', color: '#a855f7', fontSize: '0.75rem', textTransform: 'uppercase' }}>{media.media_type} • {new Date(media.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#333', margin: 0, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {media.caption}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 'bold' }}><Users size={14} /> {(media.like_count || 0).toLocaleString()} Likes</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 'bold' }}><Share2 size={14} /> {(media.comments_count || 0).toLocaleString()} Comments</div>
                  </div>
                </div>
              </div>

              {/* Individual Post Performance Chart */}
              <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Likes', count: media.like_count || 0 },
                    { name: 'Comments', count: media.comments_count || 0 },
                    { name: 'Engagement', count: (media.like_count || 0) + (media.comments_count || 0) }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
          {igMedia.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#999', border: '2px dashed #eee', borderRadius: '24px' }}>
              Connected Instagram data will appear here. No posts found for the current sync.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem', borderTop: '1px solid #000', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '900' }}>
        <span>24 DIGITALS • APRIL 2026 AUDIT</span>
        <span>PAGE 01</span>
      </div>
    </div>
  );
};

export default function PerformanceReportPage() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [instagramData, setInstagramData] = useState(null);

  useEffect(() => {
    fetch("/api/performance/data")
      .then(res => res.json())
      .then(d => {
        setData(d);
        if (session?.user?.role === 'client' && session?.user?.clientId) {
          setSelectedClientId(session.user.clientId);
        } else if (d.length > 0) {
          setSelectedClientId(d[0].id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    fetch("/api/instagram")
      .then(res => res.json())
      .then(d => setInstagramData(d))
      .catch(err => console.error("Instagram fetch error:", err));
  }, [session]);

  const selectedClient = data.find(c => c.id === selectedClientId);

  if (loading) return <div style={{ padding: "5rem", textAlign: "center" }}>Building professional audit...</div>;

  return (
    <div style={{ background: '#f4f5f7', minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .report-container { margin: 0 !important; border: none !important; box-shadow: none !important; }
          .report-page { margin: 0 !important; width: 100% !important; height: auto !important; box-shadow: none !important; }
          body { background: #fff !important; }
        }
        .sidebar { width: 300px; background: #fff; border-right: 1px solid #e2e8f0; height: 100vh; overflow-y: auto; padding: 2rem; position: sticky; top: 0; color: #000; }
        .client-btn { width: 100%; text-align: left; padding: 1rem; border-radius: 12px; margin-bottom: 0.5rem; border: 1px solid transparent; background: transparent; cursor: pointer; transition: all 0.2s; color: #000; }
        .client-btn:hover { background: #f1f5f9; }
        .client-btn.active { background: #a855f7; color: #fff; border-color: #a855f7; }
        .report-page * { text-shadow: none; }
        .report-page { background: #fff; width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: 0 40px 100px rgba(0,0,0,0.05); position: relative; color: #000; }
      `}</style>

      {/* Sidebar - No Print */}
      {session?.user?.role !== 'client' && (
        <div className="sidebar no-print">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '2rem' }}>Clients </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.map(client => (
              <button
                key={client.id}
                className={`client-btn ${selectedClientId === client.id ? 'active' : ''}`}
                onClick={() => setSelectedClientId(client.id)}
              >
                <div style={{ fontWeight: 'bold' }}>{client.name}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>ID: {client.id}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem' }} className="report-container">
        <div className="no-print" style={{ maxWidth: '210mm', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1a1a1a' }}>{session?.user?.role === 'client' ? 'Your Performance Audit' : 'Individual Client Audit'}</h1>
            <p style={{ color: '#2d3748', fontSize: '0.875rem', fontWeight: '500' }}>{session?.user?.role === 'client' ? 'Live branded progress tracking' : 'Select a client to generate a branded PDF report'}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {session?.user?.role !== 'client' && (
              <a href="/api/export/work-report" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', textDecoration: 'none', backgroundColor: '#3b82f6', color: '#fff' }}>
                <BarChart2 size={20} /> Master Excel Report
              </a>
            )}
            <button onClick={() => window.print()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem' }}>
              <Download size={20} /> Export Client PDF
            </button>
          </div>
        </div>

        {selectedClient ? (
          <ReportSegment client={selectedClient} instagramData={instagramData} />
        ) : (
          <div style={{ padding: '10rem', textAlign: 'center', color: '#aaa' }}>Select a client from the sidebar to view report</div>
        )}
      </div>
    </div>
  );
}
