"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
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
            <Cell fill="#bc1888" stroke="none" />
            <Cell fill="rgba(0,0,0,0.05)" stroke="none" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <p style={{ fontSize: '1rem', fontWeight: '900', margin: 0 }}>{value}</p>
        <p style={{ fontSize: '0.4rem', color: '#888', textTransform: 'uppercase', margin: 0, fontWeight: '700' }}>{label}</p>
      </div>
    </div>
  );
};

const ReportSegment = ({ client }) => {
  const totalTarget = client.targets.posts + client.targets.reels + client.targets.carousels;
  const totalActual = client.actual.posts + client.actual.reels + client.actual.carousels;
  const progress = totalTarget === 0 ? 0 : Math.round((totalActual / totalTarget) * 100);

  return (
    <div className="report-page" style={{ padding: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', borderBottom: '2px solid #000', paddingBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Performance Audit</h1>
          <p style={{ fontSize: '1rem', color: '#bc1888', fontWeight: '800', textTransform: 'uppercase', marginTop: '0.5rem' }}>{client.name} • April 2026</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.75rem', fontWeight: 'Bold', marginBottom: '0.5rem' }}>
              <TrendingUp size={14} /> 24 DIGITALS ENGINE
           </div>
           <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700' }}>ID: {client.id.toUpperCase()}</p>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ padding: '2rem', background: '#fafafa', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
           <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #bc1888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{progress}%</h2>
           </div>
           <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Monthly Completion</h3>
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

      {/* Target breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
         <div style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '24px', textAlign: 'center' }}>
            <DonutChart value={client.actual.posts} label="POSTS" total={client.targets.posts || 1} />
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: '800' }}>{client.actual.posts} / {client.targets.posts}</p>
         </div>
         <div style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '24px', textAlign: 'center' }}>
            <DonutChart value={client.actual.reels} label="REELS" total={client.targets.reels || 1} />
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: '800' }}>{client.actual.reels} / {client.targets.reels}</p>
         </div>
         <div style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '24px', textAlign: 'center' }}>
            <DonutChart value={client.actual.carousels} label="CAROUSELS" total={client.targets.carousels || 1} />
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', fontWeight: '800' }}>{client.actual.carousels} / {client.targets.carousels}</p>
         </div>
      </div>

      {/* Detailed Post Performance - Matching PDF */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '1.5rem' }}>Detailed Post Performance</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#000', color: '#fff' }}>
             <th style={{ padding: '1rem', textAlign: 'left' }}>DATE</th>
             <th style={{ padding: '1rem', textAlign: 'left' }}>TYPE</th>
             <th style={{ padding: '1rem', textAlign: 'left' }}>DESCRIPTION</th>
             <th style={{ padding: '1rem', textAlign: 'right' }}>REACH</th>
             <th style={{ padding: '1rem', textAlign: 'right' }}>INTERACTIONS</th>
             <th style={{ padding: '1rem', textAlign: 'center' }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {client.tasks.map((task, idx) => {
             const reach = task.reach || 0;
             const interactions = task.interactions || 0;
             
             return (
               <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{formatDate(task.dueDate)}</td>
                  <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: '#f5f5f5', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.65rem' }}>{task.title}</span></td>
                  <td style={{ padding: '1rem' }}>{task.description}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>{reach.toLocaleString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>{interactions.toLocaleString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                     <span style={{ color: task.status === 'approved' ? '#10b981' : task.status === 'completed' ? '#fbbf24' : '#ccc', fontWeight: '900' }}>
                        {task.status.toUpperCase()}
                     </span>
                  </td>
               </tr>
             )
          })}
          {client.tasks.length === 0 && (
            <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>No post records found for this period.</td></tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem', borderTop: '1px solid #000', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '900' }}>
         <span>24 DIGITALS • APRIL 2026 AUDIT</span>
         <span>PAGE 01</span>
      </div>
    </div>
  );
};

export default function PerformanceReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    fetch("/api/performance/data")
      .then(res => res.json())
      .then(d => {
        setData(d);
        if (d.length > 0) setSelectedClientId(d[0].id);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
        .sidebar { width: 300px; background: #fff; border-right: 1px solid #e2e8f0; height: 100vh; overflow-y: auto; padding: 2rem; position: sticky; top: 0; }
        .client-btn { width: 100%; text-align: left; padding: 1rem; border-radius: 12px; margin-bottom: 0.5rem; border: 1px solid transparent; background: transparent; cursor: pointer; transition: all 0.2s; }
        .client-btn:hover { background: #f8fafc; }
        .client-btn.active { background: #bc1888; color: #fff; border-color: #bc1888; }
        .report-page { background: #fff; width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: 0 40px 100px rgba(0,0,0,0.05); position: relative; }
      `}</style>

      {/* Sidebar - No Print */}
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

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem' }} className="report-container">
         <div className="no-print" style={{ maxWidth: '210mm', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1a1a1a' }}>Individual Client Audit</h1>
               <p style={{ color: '#2d3748', fontSize: '0.875rem', fontWeight: '500' }}>Select a client to generate a branded PDF report</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <a href="/api/export/work-report" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', textDecoration: 'none', backgroundColor: '#3b82f6', color: '#fff' }}>
                 <BarChart2 size={20} /> Master Excel Report
              </a>
              <button onClick={() => window.print()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem' }}>
                 <Download size={20} /> Export Client PDF
              </button>
            </div>
         </div>

         {selectedClient ? (
           <ReportSegment client={selectedClient} />
         ) : (
           <div style={{ padding: '10rem', textAlign: 'center', color: '#aaa' }}>Select a client from the sidebar to view report</div>
         )}
      </div>
    </div>
  );
}
