import React, { useMemo } from 'react';
import { useStats, useLeads } from '../hooks/useLeads';
import { LoadingCenter, Badge } from '../components/common';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const SPARK_OPTS = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor:'#161b26', titleColor:'#e2e8f5', bodyColor:'#7e8fa8', borderColor:'#1e2536', borderWidth:1, padding:8, cornerRadius:6 },
  },
  scales: { x: { display:false }, y: { display:false, beginAtZero:true } },
  elements: { point: { radius:0, hoverRadius:5, hoverBackgroundColor:'#3b82f6' } },
};

const FollowUpBadge = ({ date }) => {
  if (!date) return <span style={{ color:'var(--text-3)', fontSize:12 }}>—</span>;
  const diff  = Math.ceil((new Date(date) - new Date()) / 864e5);
  const color = diff < 0 ? '#f43f5e' : diff <= 2 ? '#f59e0b' : '#10b981';
  const label = diff < 0 ? 'Overdue' : diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `in ${diff}d`;
  return (
    <span style={{ fontSize:11, fontWeight:600, color, background:color+'18', borderRadius:20, padding:'3px 9px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:4 }}>
      <span style={{ fontSize:10 }}>●</span>{label}
    </span>
  );
};

const StatCard = ({ label, value, icon, grad, sub, onClick, accent }) => (
  <div onClick={onClick} className="stat-card" style={{
    background:'var(--bg-surface)', border:'1px solid var(--border)',
    borderRadius:16, padding:'20px 22px', cursor:'pointer',
    position:'relative', overflow:'hidden', transition:'all .2s',
  }}>
    <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:accent+'18', filter:'blur(18px)', pointerEvents:'none' }} />
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
      <div style={{ width:40, height:40, borderRadius:11, background:grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:`0 4px 14px ${accent}40` }}>{icon}</div>
      <span style={{ fontSize:10, color:'var(--text-3)', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', marginTop:4 }}>{label}</span>
    </div>
    <div style={{ fontFamily:'Inter,sans-serif', fontSize:36, fontWeight:800, color:'var(--text-1)', letterSpacing:'-.04em', lineHeight:1, marginBottom:6 }}>{value??'—'}</div>
    <div style={{ fontSize:11, color:accent, fontWeight:500 }}>{sub}</div>
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:grad, opacity:.6 }} />
  </div>
);

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useStats();
  const { leads, loading: leadsLoading } = useLeads({ page:1, limit:6 });
  const navigate = useNavigate();

  const spark = useMemo(() => {
    const last7 = Array.from({ length:7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6-i));
      return d.toISOString().slice(0,10);
    });
    const map = {};
    (stats?.daily || []).forEach(r => { map[r._id] = r.count; });
    return {
      labels: last7.map(d => new Date(d).toLocaleDateString('en-IN', { weekday:'short', day:'numeric' })),
      values: last7.map(d => map[d] || 0),
    };
  }, [stats?.daily]);

  const lineData = useMemo(() => ({
    labels: spark.labels,
    datasets: [{ data:spark.values, fill:true, borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,.10)', tension:0.45, borderWidth:2.5 }],
  }), [spark]);

  if (statsLoading) return <LoadingCenter />;

  const total     = stats?.total     || 0;
  const newLeads  = stats?.newCount  || 0;
  const contacted = stats?.contacted || 0;
  const converted = stats?.converted || 0;
  const lost      = stats?.lost      || 0;
  const qualified = stats?.qualified || 0;
  const convRate  = total > 0 ? ((converted/total)*100).toFixed(1) : '0.0';
  const weekTotal = spark.values.reduce((a,b) => a+b, 0);
  const todayCount = spark.values[6] || 0;
  const urgentFollowUps = leads.filter(l => {
    if (!l.followUpDate) return false;
    return Math.ceil((new Date(l.followUpDate) - new Date()) / 864e5) <= 3;
  }).length;

  const cell = { padding:'12px 16px', fontSize:13, color:'var(--text-2)', borderTop:'1px solid var(--border)', verticalAlign:'middle' };

  return (
    <div className="fade-up db-page">

      {/* 4 stat cards */}
      <div className="db-stat-grid">
        <StatCard label="Total Leads" value={total}     icon="👥" grad="linear-gradient(135deg,#3b82f6,#6366f1)" accent="#3b82f6" sub={`${qualified} qualified`}        onClick={() => navigate('/leads')} />
        <StatCard label="New Leads"   value={newLeads}  icon="✨" grad="linear-gradient(135deg,#f59e0b,#f97316)" accent="#f59e0b" sub="Awaiting contact"               onClick={() => navigate('/leads')} />
        <StatCard label="Contacted"   value={contacted} icon="📞" grad="linear-gradient(135deg,#8b5cf6,#d946ef)" accent="#8b5cf6" sub="In pipeline"                    onClick={() => navigate('/contacts')} />
        <StatCard label="Converted"   value={converted} icon="✅" grad="linear-gradient(135deg,#10b981,#06b6d4)" accent="#10b981" sub={`${convRate}% conversion rate`}  onClick={() => navigate('/contacts')} />
      </div>

      {/* Sparkline + Pipeline */}
      <div className="db-mid-grid">

        {/* Sparkline */}
        <div className="db-spark-card" style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:6 }}>
            <div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:700, color:'var(--text-1)' }}>Lead activity</div>
              <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>Last 7 days</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:22, fontWeight:800, color:'var(--blue)', letterSpacing:'-.03em' }}>{weekTotal}</div>
              <div style={{ fontSize:10, color:'var(--text-3)' }}>this week</div>
            </div>
          </div>
          {todayCount > 0 && (
            <div style={{ marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:600, color:'#10b981', background:'rgba(16,185,129,.12)', borderRadius:20, padding:'3px 9px' }}>+{todayCount} today</span>
            </div>
          )}
          <div style={{ height:110, position:'relative', margin:'8px 0' }}>
            <Line data={lineData} options={SPARK_OPTS} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:4 }}>
            {spark.labels.map((l,i) => <span key={i} style={{ fontSize:9, color:'var(--text-3)' }}>{l.split(' ')[0]}</span>)}
          </div>
          <button onClick={() => navigate('/analytics')} style={{ marginTop:16, padding:'8px', borderRadius:9, border:'1px solid var(--border)', background:'var(--bg-elevated)', color:'var(--blue)', fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'all .15s' }}>
            View full analytics →
          </button>
        </div>

        {/* Pipeline + quick stats */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:16, padding:'18px 20px', flex:1 }}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:700, color:'var(--text-1)', marginBottom:16 }}>Pipeline overview</div>
            {[
              { label:'New',       value:newLeads,  color:'#3b82f6' },
              { label:'Contacted', value:contacted, color:'#8b5cf6' },
              { label:'Qualified', value:qualified, color:'#f59e0b' },
              { label:'Converted', value:converted, color:'#10b981' },
              { label:'Lost',      value:lost,      color:'#f43f5e' },
            ].map(({ label, value, color }) => {
              const pct = total > 0 ? Math.round((value/total)*100) : 0;
              return (
                <div key={label} style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:12, color:'var(--text-2)', fontWeight:500 }}>{label}</span>
                    <span style={{ fontSize:12, color, fontWeight:700 }}>{value} <span style={{ color:'var(--text-3)', fontWeight:400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height:5, background:'var(--bg-elevated)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:4, transition:'width .6s cubic-bezier(.4,0,.2,1)', minWidth:pct>0?6:0 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Conversion', value:`${convRate}%`, color:'#10b981', icon:'📈' },
              { label:'Follow-ups', value:urgentFollowUps, color:'#f59e0b', icon:'📅' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px' }}>
                <div style={{ fontSize:18, marginBottom:6 }}>{icon}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:22, fontWeight:800, color, letterSpacing:'-.03em', lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:11, color:'var(--text-3)', marginTop:4, fontWeight:500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px 14px', borderBottom:'1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:700, color:'var(--text-1)' }}>Recent Leads</div>
            <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>Latest entries across all statuses</div>
          </div>
          <button onClick={() => navigate('/leads')} style={{ fontSize:12, color:'var(--blue)', background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.2)', borderRadius:20, padding:'5px 14px', cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:500 }}>
            View all →
          </button>
        </div>

        {leadsLoading ? <LoadingCenter /> : leads.length === 0 ? (
          <div style={{ padding:'40px 20px', textAlign:'center' }}>
            <div style={{ fontSize:32, marginBottom:10 }}>📭</div>
            <div style={{ fontSize:14, fontWeight:600, color:'var(--text-1)', marginBottom:6 }}>No leads yet</div>
            <button onClick={() => navigate('/leads')} style={{ fontSize:13, color:'var(--blue)', background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.2)', borderRadius:20, padding:'6px 16px', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
              + Add your first lead
            </button>
          </div>
        ) : (
          <>
            <div className="db-table-wrap" style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                <thead>
                  <tr style={{ background:'var(--bg-elevated)' }}>
                    {['Name','Source','Status','Follow-up','Added'].map(h => (
                      <th key={h} style={{ padding:'9px 16px', fontSize:10, fontWeight:600, color:'var(--text-3)', textAlign:'left', letterSpacing:'.07em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead._id} style={{ transition:'background .1s', cursor:'pointer' }}
                      onClick={() => navigate('/leads')}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.018)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <td style={cell}>
                        <div style={{ fontWeight:600, color:'var(--text-1)', fontSize:13, whiteSpace:'nowrap' }}>{lead.name}</div>
                        <div style={{ fontSize:11, color:'var(--text-3)', marginTop:1 }}>{lead.email}</div>
                      </td>
                      <td style={cell}><Badge label={lead.source} /></td>
                      <td style={cell}><Badge label={lead.status} /></td>
                      <td style={cell}><FollowUpBadge date={lead.followUpDate} /></td>
                      <td style={{ ...cell, fontSize:11, color:'var(--text-3)', whiteSpace:'nowrap' }}>
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="db-card-list">
              {leads.map((lead, idx) => (
                <div key={lead._id} onClick={() => navigate('/leads')}
                  style={{ padding:'14px 16px', cursor:'pointer', borderBottom: idx < leads.length-1 ? '1px solid var(--border)' : 'none', transition:'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.015)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:600, color:'var(--text-1)', fontSize:14 }}>{lead.name}</div>
                      <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>{lead.email}</div>
                    </div>
                    <Badge label={lead.status} />
                  </div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                    <Badge label={lead.source} />
                    <FollowUpBadge date={lead.followUpDate} />
                    <span style={{ fontSize:11, color:'var(--text-3)', marginLeft:'auto' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .db-page { display:flex; flex-direction:column; gap:16px; }
        .db-stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .db-mid-grid  { display:grid; grid-template-columns:1.1fr 1fr; gap:14px; align-items:start; }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,.35); border-color:var(--border-light) !important; }
        .db-card-list { display:none; }

        @media (max-width:900px) { .db-stat-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:700px) { .db-mid-grid  { grid-template-columns:1fr; } }
        @media (max-width:540px) {
          .db-stat-grid { grid-template-columns:1fr 1fr; gap:10px; }
          .db-table-wrap { display:none; }
          .db-card-list  { display:block; }
          .stat-card { padding:14px 16px !important; }
          .stat-card > div:nth-child(3) { font-size:28px !important; }
        }
        @media (max-width:360px) { .db-stat-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}