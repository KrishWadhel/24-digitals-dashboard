"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Download, FileText, Upload, TrendingUp, Users, Share2, CheckCircle, 
  Target, ArrowRight, Smartphone, BarChart2, Eye, Heart, MessageCircle, 
  Navigation, MousePointer2, Award, Zap, Loader2, Plus, Trash2, Camera
} from "lucide-react";
import { formatDate } from "@/lib/format";

// --- Design Constants ---
const COLORS = {
  primary: "#ec4899", // Instagram Pink/Pink
  secondary: "#3b82f6",
  accent: "#8b5cf6",
  success: "#10b981",
  text: "#000000",
  textSecondary: "#64748b",
  bg: "#ffffff",
  cardBg: "rgba(255, 255, 255, 0.9)",
  glass: "rgba(255, 255, 255, 0.4)"
};

// --- Components ---

const GlassCard = ({ children, style = {} }) => (
  <div style={{
    background: COLORS.cardBg,
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0,0,0,0.05)',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
    textAlign: 'center',
    ...style
  }}>
    {children}
  </div>
);

const StatCard = ({ label, value, color }) => (
  <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', borderTop: `4px solid ${color}` }}>
    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
    <h2 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', color: COLORS.text }}>{value}</h2>
  </GlassCard>
);

const ReportRenderer = ({ reportData, posts, clientName }) => {
  const totals = reportData.totals || {};
  const audience = reportData.audience || { gender: { men: null, women: null }, cities: [] };
  
  return (
    <div className="report-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page 1: Cover (Center Focused, No Icons) */}
      <div className="report-page cover-page" style={{ padding: '4rem', background: '#fff', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ marginBottom: '5rem' }}>
             <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', letterSpacing: '8px', color: '#000', margin: 0 }}>24 DIGITALS</h2>
             <div style={{ height: '2px', width: '40px', background: '#ec4899', margin: '1.5rem auto' }}></div>
          </div>
          
          <div style={{ margin: '4rem 0' }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', margin: 0, letterSpacing: '-3px', lineHeight: 1 }}>Social Media</h1>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '300', margin: 0, letterSpacing: '-3px', lineHeight: 1, color: '#666' }}>Performance Report</h1>
          </div>
          
          <div style={{ marginTop: '5rem', padding: '2rem', border: '1px solid #f0f0f0', borderRadius: '24px', background: '#fafafa' }}>
            <p style={{ margin: 0, color: '#ec4899', fontWeight: '900', fontSize: '1.75rem', letterSpacing: '1px' }}>{clientName.toUpperCase()}</p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '1.1rem', fontWeight: '500' }}>AUDIT CYCLE: APRIL 2026</p>
          </div>
        </div>
      </div>

      {/* Page 2: Strategic Overview */}
      <div className="report-page" style={{ padding: '4rem', background: '#fff', border: '1px solid #eee' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4rem', textAlign: 'center', letterSpacing: '-1px' }}>Strategic Overview</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
          {reportData.screenshots && reportData.screenshots.length > 0 && reportData.screenshots.map((s, i) => (
            <div key={i} style={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fff' }}>
               <img 
                src={s.data} 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
                alt={`Overview ${i + 1}`} 
              />
            </div>
          ))}

          {!reportData.screenshots || reportData.screenshots.length === 0 && (
            <div style={{ padding: '10rem', textAlign: 'center', border: '2px dashed #eee', borderRadius: '48px', color: '#ccc' }}>
              <Camera size={64} style={{ opacity: 0.1, marginBottom: '2rem' }} />
              <p>No overview PNGs uploaded for this cycle.</p>
            </div>
          )}
        </div>
      </div>

      {/* Page 3: Audience Hub */}
      {(audience.gender.men !== null || audience.cities.length > 0) && (
        <div className="report-page" style={{ padding: '4rem', background: '#fff', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4rem', textAlign: 'center', letterSpacing: '-1px' }}>Audience Insights</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {audience.gender.men !== null && (
              <div style={{ background: '#000', borderRadius: '32px', padding: '3rem', color: '#fff', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Gender Distribution</h3>
                 <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[
                        { name: 'Men', value: audience.gender.men },
                        { name: 'Women', value: audience.gender.women }
                      ]} innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                        <Cell fill="#ec4899" stroke="none" />
                        <Cell fill="#333" stroke="none" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                   <div style={{ textAlign: 'center' }}><p style={{ margin: 0, opacity: 0.6, fontSize: '0.8rem' }}>MEN</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{audience.gender.men}%</p></div>
                   <div style={{ textAlign: 'center' }}><p style={{ margin: 0, opacity: 0.6, fontSize: '0.8rem' }}>WOMEN</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{audience.gender.women}%</p></div>
                </div>
              </div>
            )}

            {audience.cities.length > 0 && (
              <div style={{ background: '#f8fafc', borderRadius: '32px', padding: '3rem', border: '1px solid #eee', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Regions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {audience.cities.slice(0, 5).map((city, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        <span>{city.name}</span>
                        <span>{city.value}%</span>
                      </div>
                      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#ec4899', width: `${city.value}%`, borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pages: Per-Post Detail */}
      {posts.map((post, idx) => (
        <div key={idx} className="report-page" style={{ padding: '4rem', background: '#fff', border: '1px solid #eee', pageBreakBefore: 'always' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Content Breakdown {idx + 1}</h2>
              <span style={{ padding: '0.5rem 1rem', background: '#f5f5f5', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>Instagram / {post.views > 500 ? 'Reel' : 'Post'}</span>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '3rem' }}>
              <div style={{ borderRadius: '32px', overflow: 'hidden', height: '600px', background: '#f8f8f8', border: '1px solid #eee', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                 {post.mediaUrl ? (
                   <img 
                    src={`/api/proxy-image?url=${encodeURIComponent(post.mediaUrl)}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt="Post" 
                  />
                 ) : (
                   <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc', padding: '2rem', textAlign: 'center' }}>
                      <Camera size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                      <p style={{ fontSize: '0.75rem' }}>Visual Scout Pending</p>
                      <a href={post.permalink} target="_blank" style={{ fontSize: '0.6rem', color: '#ec4899', wordBreak: 'break-all' }}>{post.permalink}</a>
                   </div>
                 )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #eee' }}>
                   <p style={{ color: '#ec4899', fontWeight: '900', fontSize: '0.7rem', marginBottom: '1rem', letterSpacing: '2px' }}>CAPTION</p>
                   <p style={{ fontSize: '1.05rem', fontWeight: '600', lineHeight: 1.5, color: COLORS.text, margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{post.description || "No caption data found."}</p>
                   <p style={{ marginTop: '1.5rem', color: COLORS.textSecondary, fontSize: '0.75rem', fontWeight: 'bold' }}>{post.publishTime}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div style={{ padding: '1.25rem', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '16px' }}>
                      <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 'bold', color: '#999' }}>VIEWS</p>
                      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{post.views?.toLocaleString() || 0}</p>
                   </div>
                   <div style={{ padding: '1.25rem', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '16px' }}>
                      <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 'bold', color: '#999' }}>REACH</p>
                      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{post.reach?.toLocaleString() || 0}</p>
                   </div>
                   <div style={{ padding: '1.25rem', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '16px' }}>
                      <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 'bold', color: '#999' }}>INTERACTIONS</p>
                      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#ec4899' }}>{post.interactions?.toLocaleString() || 0}</p>
                   </div>
                   <div style={{ padding: '1.25rem', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '16px' }}>
                      <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 'bold', color: '#999' }}>LIKES</p>
                      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{post.likes?.toLocaleString() || 0}</p>
                   </div>
                </div>

                <div style={{ height: '150px', marginTop: '1rem' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Likes', val: post.likes },
                      { name: 'Saves', val: post.saves },
                      { name: 'Shares', val: post.shares },
                      { name: 'Comms', val: post.comments }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" axisLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} />
                      <Bar dataKey="val" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
};

export default function PerformanceReportPage() {
  const { data: session } = useSession();
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

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
      setReport(null);
      fetch(`/api/report/latest?clientId=${selectedClientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.found) setReport(data);
        });
    }
  }, [selectedClientId]);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > 5) {
      alert("Maximum 5 files allowed.");
      return;
    }
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    if (files.length === 0) return alert("Select at least 1 file.");
    setIsProcessing(true);

    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    formData.append("clientId", selectedClientId);

    try {
      const res = await fetch("/api/report/analyze", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Refresh report
        const res2 = await fetch(`/api/report/latest?clientId=${selectedClientId}`);
        const data2 = await res2.json();
        setReport(data2);
        setFiles([]);
      } else {
        alert("Strategic Engine Error: " + (data.error || "Unknown analysis failure"));
      }
    } catch (err) {
      console.error(err);
      alert("Analysis failed to start. Ensure the server is active and the files are reachable.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: "5rem", textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> Loading center...</div>;

  return (
    <div style={{ background: '#f4f5f7', minHeight: '100vh', display: 'flex', color: '#000' }}>
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #fff !important;
          }
          .no-print { display: none !important; }
          .report-container { 
            margin: 0 !important; 
            border: none !important; 
            box-shadow: none !important; 
            padding: 0 !important; 
            display: block !important;
            gap: 0 !important;
          }
          .report-page { 
            margin: 0 !important; 
            width: 210mm !important; 
            height: 297mm !important; 
            box-shadow: none !important; 
            border: none !important; 
            padding: 4rem !important; 
            page-break-after: always;
            page-break-inside: avoid;
            box-sizing: border-box !important;
          }
        }
        .report-page { background: #fff; width: 210mm; min-height: 297mm; margin: 0 auto; box-shadow: 0 40px 100px rgba(0,0,0,0.05); position: relative; color: #000; overflow: hidden; box-sizing: border-box; }
        .sidebar { width: 320px; background: #fff; border-right: 1px solid #e2e8f0; height: 100vh; overflow-y: auto; padding: 2rem; position: sticky; top: 0; }
        .client-selector { width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #eee; background: #f8fafc; margin-bottom: 2rem; font-weight: bold; }
        .dropzone { border: 2px dashed #e2e8f0; border-radius: 24px; padding: 2rem; text-align: center; background: #f8fafc; transition: 0.3s; cursor: pointer; }
        .dropzone:hover { border-color: #ec4899; background: #fff; }
      `}</style>

      {/* Control Sidebar */}
      <div className="sidebar no-print">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 color="#ec4899" /> Strategic Audit
        </h2>

        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Select Client</p>
        <select 
          className="client-selector" 
          value={selectedClientId} 
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase' }}>Upload Source Files (1-5)</p>
        <div className="dropzone" onClick={() => fileInputRef.current.click()}>
           <Upload size={32} style={{ margin: '0 auto 1rem auto', color: '#64748b' }} />
           <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Drop PDFs or Excel sheets here</p>
           <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Supports .pdf, .xlsx, .csv, .png</p>
           <input 
              type="file" 
              multiple 
              onChange={handleFileUpload} 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf,.xlsx,.csv,.png,.jpg" 
            />
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           {files.map((f, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.75rem' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>{f.name}</span>
                <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => removeFile(i)} />
             </div>
           ))}
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={isProcessing || files.length === 0}
          className="btn-primary" 
          style={{ width: '100%', marginTop: '2rem', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
        >
          {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />} 
          Run Strategic Analysis
        </button>

        {report && (
          <button 
            onClick={() => window.print()} 
            className="btn-secondary" 
            style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}
          >
            <Download size={20} style={{ display: 'inline', marginRight: '0.5rem' }} /> Export Branded PDF
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '3rem' }}>
        {!report && !isProcessing && (
           <div style={{ padding: '10rem', textAlign: 'center', color: '#aaa', border: '2px dashed #eee', borderRadius: '48px' }}>
              <Camera size={64} style={{ opacity: 0.1, marginBottom: '2rem' }} />
              <h2 style={{ fontSize: '1.5rem', color: '#ccc' }}>Audit Engine Idle</h2>
              <p>Upload your data files to generate a premium strategic report.</p>
           </div>
        )}

        {isProcessing && (
           <div style={{ padding: '10rem', textAlign: 'center' }}>
              <div className="sync-spinner" style={{ width: '80px', height: '80px', border: '6px solid #fce7f3', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem auto' }}></div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900' }}>DECONSTRUCTING ASSETS...</h2>
              <p style={{ color: '#64748b' }}>Applying Interaction Formula & Extracting Multi-Platform Data</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
           </div>
        )}

        {report && !isProcessing && (
          <ReportRenderer 
            reportData={report.data} 
            posts={report.posts} 
            clientName={clients.find(c => c.id === selectedClientId)?.name || "Client"} 
          />
        )}
      </div>
    </div>
  );
}
