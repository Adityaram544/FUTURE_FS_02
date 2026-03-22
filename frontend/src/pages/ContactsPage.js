import React, { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { Card, Badge, LoadingCenter, EmptyState } from '../components/common';

const TABS = [
  { key: 'Contacted', label: 'Contacted', color: '#f59e0b', bg: 'rgba(245,158,11,.12)', icon: '📞' },
  { key: 'Qualified',  label: 'Qualified',  color: '#8b5cf6', bg: 'rgba(139,92,246,.12)', icon: '⭐' },
  { key: 'Converted',  label: 'Converted',  color: '#10b981', bg: 'rgba(16,185,129,.12)', icon: '✅' },
];

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

export default function ContactsPage() {
  const [tab, setTab] = useState('Contacted');
  const { leads, pagination, loading } = useLeads({ status: tab, limit: 20 });
  const activeTab = TABS.find(t => t.key === tab);

  const cell = {
    padding: '11px 14px', fontSize: 13,
    color: 'var(--text-2)', borderTop: '1px solid var(--border)',
    verticalAlign: 'top',
  };

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stat cards */}
      <div className="contacts-stat-grid">
        {TABS.map(({ key, label, color, bg, icon }) => (
          <div
            key={key}
            onClick={() => setTab(key)}
            className="contacts-stat-card"
            style={{
              background: 'var(--bg-surface)',
              border: tab === key ? `1.5px solid ${color}55` : '1px solid var(--border)',
              borderRadius: 14, cursor: 'pointer', transition: 'all .18s',
              boxShadow: tab === key ? `0 4px 20px ${color}18` : 'none',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, flexShrink: 0,
            }}>{icon}</div>

            <div className="contacts-stat-text">
              <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{label}</div>
              <div style={{
                fontFamily: 'Inter,sans-serif', fontSize: 24, fontWeight: 800,
                color: tab === key ? color : 'var(--text-1)',
                letterSpacing: '-.03em', lineHeight: 1.1,
              }}>
                {tab === key ? (loading ? '…' : pagination.total) : '—'}
              </div>
            </div>

            {tab === key && (
              <div className="contacts-stat-badge" style={{
                fontSize: 10, color, fontWeight: 600,
                background: bg, borderRadius: 20,
                padding: '2px 8px', whiteSpace: 'nowrap',
              }}>Active</div>
            )}
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', transition: 'all .15s',
              border: tab === key ? 'none' : '1px solid var(--border)',
              background: tab === key
                ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                : 'var(--bg-elevated)',
              color: tab === key ? '#fff' : 'var(--text-2)',
              fontFamily: 'Inter, sans-serif',
            }}
          >{label}</button>
        ))}
        {!loading && (
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)' }}>
            {pagination.total} record{pagination.total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Data area */}
      <Card noPad>
        {loading ? (
          <LoadingCenter />
        ) : leads.length === 0 ? (
          <EmptyState
            icon={activeTab?.icon || '📭'}
            title={`No ${tab} leads yet`}
            sub="Leads with this status will appear here."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="contacts-table-wrap">
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-elevated)' }}>
                      {['Contact','Company','Source','Status','Follow-up','Added'].map(h => (
                        <th key={h} style={{
                          padding: '9px 14px', fontSize: 10, fontWeight: 600,
                          color: 'var(--text-3)', textAlign: 'left',
                          letterSpacing: '.07em', textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr
                        key={lead._id}
                        style={{ transition: 'background .1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.015)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={cell}>
                          <div style={{ fontWeight: 500, color: 'var(--text-1)', fontSize: 13, whiteSpace: 'nowrap' }}>
                            {lead.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{lead.email}</div>
                          {lead.phone && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{lead.phone}</div>}
                        </td>
                        <td style={cell}>
                          {lead.company || <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>}
                        </td>
                        <td style={cell}><Badge label={lead.source} /></td>
                        <td style={cell}><Badge label={lead.status} /></td>
                        <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                          {fmtDate(lead.followUpDate)
                            ? <span style={{ fontSize: 12, color: 'var(--amber)' }}>📅 {fmtDate(lead.followUpDate)}</span>
                            : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>}
                        </td>
                        <td style={{ ...cell, fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                          {fmtDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile card list */}
            <div className="contacts-card-list">
              {leads.map((lead, idx) => (
                <div
                  key={lead._id}
                  style={{
                    padding: '14px 16px',
                    borderBottom: idx < leads.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between', gap: 10, marginBottom: 8,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, color: 'var(--text-1)', fontSize: 14,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{lead.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{lead.email}</div>
                    </div>
                    <Badge label={lead.status} />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                    {lead.phone && (
                      <span style={{
                        fontSize: 11, color: 'var(--text-2)',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        borderRadius: 6, padding: '3px 8px',
                      }}>📱 {lead.phone}</span>
                    )}
                    {lead.company && (
                      <span style={{
                        fontSize: 11, color: 'var(--text-2)',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        borderRadius: 6, padding: '3px 8px',
                      }}>🏢 {lead.company}</span>
                    )}
                    <Badge label={lead.source} />
                  </div>

                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {fmtDate(lead.followUpDate) && (
                      <span style={{ fontSize: 11, color: 'var(--amber)' }}>
                        📅 {fmtDate(lead.followUpDate)}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      Added {fmtDate(lead.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{
          padding: '10px 16px', fontSize: 12,
          color: 'var(--text-3)', borderTop: '1px solid var(--border)',
        }}>
          {loading ? 'Loading…' : `${pagination.total} record${pagination.total !== 1 ? 's' : ''}`}
        </div>
      </Card>

      <style>{`
        .contacts-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .contacts-stat-card {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contacts-stat-text  { display: flex; flex-direction: column; gap: 3px; }
        .contacts-stat-badge { align-self: flex-start; }

        @media (max-width: 540px) {
          .contacts-stat-grid { grid-template-columns: 1fr; gap: 8px; }
          .contacts-stat-card {
            flex-direction: row !important;
            align-items: center !important;
            padding: 12px 14px !important;
            gap: 12px !important;
          }
          .contacts-stat-text {
            flex: 1;
            flex-direction: row !important;
            align-items: baseline !important;
            gap: 10px !important;
          }
          .contacts-stat-text > div:last-child { font-size: 20px !important; }
          .contacts-stat-badge { margin-left: auto; }
        }

        @media (min-width: 541px) and (max-width: 720px) {
          .contacts-stat-card { padding: 12px 14px !important; }
          .contacts-stat-text > div:last-child { font-size: 20px !important; }
        }

        .contacts-card-list { display: none; }
        @media (max-width: 599px) {
          .contacts-table-wrap { display: none; }
          .contacts-card-list  { display: block; }
        }

        @media (max-width: 768px) {
          .contacts-table-wrap th,
          .contacts-table-wrap td {
            padding: 8px 10px !important;
            font-size: 12px !important;
          }
        }

        .contacts-stat-card:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}