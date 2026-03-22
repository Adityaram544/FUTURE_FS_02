import React, { useState, useCallback } from 'react';
import { useLeads } from '../hooks/useLeads';
import { Card, Badge, LoadingCenter, EmptyState, ConfirmModal, Pagination } from '../components/common';
import LeadForm   from '../components/leads/LeadForm';
import NotesModal from '../components/leads/NotesModal';

const STATUSES = ['All','New','Contacted','Qualified','Converted','Lost'];

/* ── CSV export ─────────────────────────────────────────── */
const exportToCSV = (leads) => {
  if (!leads || leads.length === 0) return;
  const now      = new Date();
  const fileDate = now.toISOString().slice(0, 10);
  const showDate = now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  const showTime = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });

  const cell      = v => `"${String(v??'').trim().replace(/"/g,'""')}"`;
  const phoneCell = v => { const s=String(v??'').trim(); return s ? `"\t${s}"` : `""`; };
  const dateCell  = v => { const s=String(v??'').trim(); return s ? `"'${s}"` : `""`; };
  const fmtDate   = iso => iso
    ? new Date(iso).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
    : 'Not Set';

  const statusOrder = ['New','Contacted','Qualified','Converted','Lost'];
  const statusCount = leads.reduce((a,l) => {
    a[l.status] = (a[l.status]||0) + 1; return a;
  }, {});

  const COLS = 9;
  const labelRow = t  => [cell(t), ...Array(COLS-1).fill('""')].join(',');
  const infoRow  = (k,v) => [cell(k), cell(v), ...Array(COLS-2).fill('""')].join(',');

  const lines = [
    labelRow('CRMPro - Lead Export Report'),
    infoRow('Generated Date', showDate),
    infoRow('Generated Time', showTime),
    infoRow('Total Records',  String(leads.length)),
    Array(COLS).fill('""').join(','),

    labelRow('SUMMARY BY STATUS'),
    [cell('Status'), cell('Count'), ...Array(COLS-2).fill('""')].join(','),
    ...statusOrder
      .filter(s => statusCount[s])
      .map(s => [cell(s), cell(String(statusCount[s])), ...Array(COLS-2).fill('""')].join(',')),
    Array(COLS).fill('""').join(','),

    labelRow('LEAD DETAILS'),
    [cell('#'),cell('Name'),cell('Email'),cell('Phone'),cell('Company'),
     cell('Source'),cell('Status'),cell('Follow-Up Date'),cell('Created At')].join(','),

    ...leads.map((l,i) => [
      cell(i+1),
      cell(l.name    || ''),
      cell(l.email   || ''),
      phoneCell(l.phone   || ''),
      cell(l.company || ''),
      cell(l.source  || ''),
      cell(l.status  || ''),
      dateCell(fmtDate(l.followUpDate)),
      dateCell(fmtDate(l.createdAt)),
    ].join(',')),

    Array(COLS).fill('""').join(','),
    infoRow('End of Report', `${leads.length} record(s) exported`),
  ];

  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `CRMPro_Leads_${fileDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ── Status colour map ───────────────────────────────────── */
const STATUS_COLOR = {
  New:'#3b82f6', Contacted:'#f59e0b', Qualified:'#8b5cf6',
  Converted:'#10b981', Lost:'#f43f5e',
};

/* ── Page ────────────────────────────────────────────────── */
export default function LeadsPage() {
  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState('All');
  const [page,      setPage]      = useState(1);
  const [formOpen,  setFormOpen]  = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [deleting,  setDeleting]  = useState(null);
  const [notes,     setNotes]     = useState(null);
  const [delBusy,   setDelBusy]   = useState(false);
  const [exporting, setExporting] = useState(false);

  const { leads, pagination, loading, createLead, updateLead, deleteLead, addNote } = useLeads({
    status, search, page, limit: 10,
  });
  const { leads: allLeads } = useLeads({
    status, search, page: 1, limit: 9999,
  });

  const openAdd  = () => { setEditing(null); setFormOpen(true); };
  const openEdit = l  => { setEditing(l);    setFormOpen(true); };

  const handleSubmit = async data => {
    if (editing) await updateLead(editing._id, data);
    else         await createLead(data);
  };

  const handleDelete = async () => {
    setDelBusy(true);
    try { await deleteLead(deleting._id); setDeleting(null); }
    finally { setDelBusy(false); }
  };

  const handleExport = useCallback(async () => {
    if (exporting || allLeads.length === 0) return;
    setExporting(true);
    await new Promise(r => setTimeout(r, 180));
    exportToCSV(allLeads);
    setExporting(false);
  }, [allLeads, exporting]);

  const fmtDate = iso => iso
    ? new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    : null;

  const cell = {
    padding: '11px 14px', fontSize: 13,
    color: 'var(--text-2)', borderTop: '1px solid var(--border)',
  };

  const iconBtn = (danger = false) => ({
    width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
    border: danger ? '1px solid rgba(244,63,94,.25)' : '1px solid var(--border)',
    background: danger ? 'rgba(244,63,94,.08)' : 'var(--bg-elevated)',
    color: danger ? '#f43f5e' : 'var(--text-2)',
    transition: 'all .12s',
  });

  return (
    <div className="fade-up">
      <Card noPad>

        {/* ── Top bar ──────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap',
          gap: 10, padding: '14px 16px 12px',
          borderBottom: '1px solid var(--border)',
        }}>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            flex: '1 1 160px', minWidth: 0,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 12px',
          }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
              stroke="var(--text-3)" strokeWidth={2} style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, email or company…"
              style={{
                border: 'none', background: 'transparent',
                color: 'var(--text-1)', fontSize: 13, outline: 'none',
                flex: 1, minWidth: 0, fontFamily: 'Inter, sans-serif',
              }}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-3)',
                  cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0, flexShrink: 0,
                }}
              >×</button>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>

            {/* Export */}
            <button
              onClick={handleExport}
              disabled={exporting || leads.length === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                fontSize: 12, fontWeight: 500,
                cursor: exporting || leads.length === 0 ? 'not-allowed' : 'pointer',
                opacity: leads.length === 0 ? 0.45 : 1,
                border: '1px solid var(--border)',
                background: exporting ? 'rgba(16,185,129,.1)' : 'var(--bg-elevated)',
                color: exporting ? 'var(--green)' : 'var(--text-2)',
                transition: 'all .15s', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
              }}
            >
              {exporting ? (
                <>
                  <div style={{
                    width: 12, height: 12, border: '2px solid var(--border)',
                    borderTopColor: 'var(--green)', borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <span className="lbl">Exporting…</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span className="lbl">Export</span>
                </>
              )}
            </button>

            {/* Add Lead */}
            <button
              onClick={openAdd}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8,
                fontSize: 12, fontWeight: 500,
                cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                color: '#fff',
                boxShadow: '0 2px 10px rgba(139,92,246,.35)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5"  y1="12" x2="19" y2="12"/>
              </svg>
              <span className="lbl">Add Lead</span>
            </button>
          </div>
        </div>

        {/* ── Filter pills ─────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap',
          gap: 5, padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500,
              cursor: 'pointer', transition: 'all .15s', fontFamily: 'Inter, sans-serif',
              border: s === status ? 'none' : '1px solid var(--border)',
              background: s === status
                ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                : 'var(--bg-elevated)',
              color: s === status ? '#fff' : 'var(--text-2)',
            }}>{s}</button>
          ))}
          {!loading && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
              {pagination.total} lead{pagination.total !== 1 ? 's' : ''}
              {(search || status !== 'All') && ' matched'}
            </span>
          )}
        </div>

        {/* ── Content ──────────────────────────────── */}
        {loading ? (
          <LoadingCenter />
        ) : leads.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No leads found"
            sub={search || status !== 'All'
              ? 'Try a different filter or search.'
              : 'Click "Add Lead" to get started.'}
          />
        ) : (
          <>
            {/* Desktop table — hidden below 600px */}
            <div className="leads-table-wrap" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)' }}>
                    {['Name / Email','Source','Status','Follow-up','Created','Actions'].map(h => (
                      <th key={h} style={{
                        padding: '9px 14px', fontSize: 10, fontWeight: 600,
                        color: 'var(--text-3)', textAlign: 'left',
                        letterSpacing: '.07em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead._id} style={{ transition: 'background .1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.015)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={cell}>
                        <div style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: 13, whiteSpace: 'nowrap' }}>
                          {lead.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{lead.email}</div>
                        {lead.company && (
                          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{lead.company}</div>
                        )}
                      </td>
                      <td style={cell}><Badge label={lead.source} /></td>
                      <td style={cell}><Badge label={lead.status} /></td>
                      <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                        {fmtDate(lead.followUpDate)
                          ? <span style={{ fontSize: 12, color: 'var(--amber)' }}>📅 {fmtDate(lead.followUpDate)}</span>
                          : <span style={{ fontSize: 12, color: 'var(--text-3)' }}>—</span>}
                      </td>
                      <td style={{ ...cell, fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button title="Notes"  onClick={() => setNotes(lead)}    style={iconBtn()}>📝</button>
                          <button title="Edit"   onClick={() => openEdit(lead)}    style={iconBtn()}>✏️</button>
                          <button title="Delete" onClick={() => setDeleting(lead)} style={iconBtn(true)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — shown below 600px */}
            <div className="leads-card-list">
              {leads.map((lead, idx) => {
                const sc = STATUS_COLOR[lead.status] || '#7e8fa8';
                return (
                  <div key={lead._id} style={{
                    padding: '14px 16px',
                    borderBottom: idx < leads.length - 1 ? '1px solid var(--border)' : 'none',
                    position: 'relative',
                  }}>
                    {/* Coloured left accent bar */}
                    <div style={{
                      position: 'absolute', left: 0, top: 14, bottom: 14,
                      width: 3, borderRadius: '0 3px 3px 0', background: sc,
                    }} />

                    {/* Row 1: name + status badge */}
                    <div style={{
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', gap: 8, marginBottom: 8,
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontWeight: 700, color: 'var(--text-1)', fontSize: 14,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{lead.name}</div>
                        <div style={{
                          fontSize: 12, color: 'var(--text-3)', marginTop: 2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{lead.email}</div>
                      </div>
                      <Badge label={lead.status} />
                    </div>

                    {/* Row 2: source, company, follow-up, date */}
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: 6,
                      alignItems: 'center', marginBottom: 12,
                    }}>
                      <Badge label={lead.source} />
                      {lead.company && (
                        <span style={{
                          fontSize: 11, color: 'var(--text-2)',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: 6, padding: '2px 8px',
                        }}>🏢 {lead.company}</span>
                      )}
                      {fmtDate(lead.followUpDate) && (
                        <span style={{
                          fontSize: 11, color: 'var(--amber)',
                          background: 'rgba(245,158,11,.1)',
                          borderRadius: 6, padding: '2px 8px',
                        }}>📅 {fmtDate(lead.followUpDate)}</span>
                      )}
                      <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 'auto' }}>
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Row 3: full-width action buttons */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { label: '📝 Notes',  onClick: () => setNotes(lead),    danger: false },
                        { label: '✏️ Edit',   onClick: () => openEdit(lead),    danger: false },
                        { label: '✕ Delete', onClick: () => setDeleting(lead), danger: true  },
                      ].map(({ label, onClick, danger }) => (
                        <button key={label} onClick={onClick} style={{
                          flex: 1, padding: '8px 0', borderRadius: 8,
                          border: danger ? '1px solid rgba(244,63,94,.25)' : '1px solid var(--border)',
                          background: danger ? 'rgba(244,63,94,.07)' : 'var(--bg-elevated)',
                          color: danger ? '#f43f5e' : 'var(--text-2)',
                          fontSize: 12, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                          fontFamily: 'Inter, sans-serif', fontWeight: 500,
                          transition: 'all .12s',
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        <div style={{ padding: '4px 16px 14px' }}>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      </Card>

      {/* Modals */}
      <LeadForm
        isOpen={formOpen} onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit} initial={editing}
      />
      <NotesModal
        isOpen={!!notes} onClose={() => setNotes(null)}
        lead={notes} onAddNote={addNote}
      />
      <ConfirmModal
        isOpen={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={handleDelete} loading={delBusy}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
      />

      <style>{`
        /* Table on ≥600px, cards on <600px */
        .leads-card-list  { display: none; }
        @media (max-width: 599px) {
          .leads-table-wrap { display: none; }
          .leads-card-list  { display: block; }
        }
        /* Tighter table cells on tablet */
        @media (max-width: 768px) {
          .leads-table-wrap th,
          .leads-table-wrap td { padding: 8px 10px !important; font-size: 12px !important; }
        }
        /* Hide button labels on very small screens */
        @media (max-width: 380px) { .lbl { display: none; } }
      `}</style>
    </div>
  );
}