import React from 'react';

/* ── Button ─────────────────────────────────────── */
export const Button = ({ children, variant = 'primary', size = 'md', icon, onClick, disabled, type = 'button', style = {} }) => {
  const s = {
    sm: { padding: '5px 12px',  fontSize: 12 },
    md: { padding: '8px 18px',  fontSize: 13 },
    lg: { padding: '11px 24px', fontSize: 14 },
  }[size];

  const v = {
    primary:   { background: 'var(--grad-primary)', color: '#fff', border: 'none', boxShadow: '0 2px 12px rgba(139,92,246,.3)' },
    secondary: { background: 'var(--bg-elevated)',  color: 'var(--text-1)', border: '1px solid var(--border)' },
    danger:    { background: 'rgba(244,63,94,.1)',   color: 'var(--rose)',   border: '1px solid rgba(244,63,94,.25)' },
    ghost:     { background: 'transparent',          color: 'var(--text-2)', border: '1px solid var(--border)' },
    success:   { background: 'var(--grad-green)',    color: '#fff', border: 'none' },
  }[variant];

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: 6, borderRadius: 'var(--radius-sm)', fontFamily: 'Inter, sans-serif',
      fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1, transition: 'all var(--t)',
      whiteSpace: 'nowrap', ...s, ...v, ...style,
    }}>
      {icon && icon}{children}
    </button>
  );
};

/* ── Badge ──────────────────────────────────────── */
const BADGE_COLORS = {
  New:          ['rgba(59,130,246,.15)',  '#60a5fa'],
  Contacted:    ['rgba(245,158,11,.15)',  '#fbbf24'],
  Qualified:    ['rgba(139,92,246,.15)', '#a78bfa'],
  Converted:    ['rgba(16,185,129,.15)', '#34d399'],
  Lost:         ['rgba(244,63,94,.15)',  '#fb7185'],
  Website:      ['rgba(6,182,212,.15)',  '#22d3ee'],
  Referral:     ['rgba(16,185,129,.15)', '#34d399'],
  'Social Media':['rgba(139,92,246,.15)','#a78bfa'],
  Email:        ['rgba(245,158,11,.15)', '#fbbf24'],
  'Cold Call':  ['rgba(244,63,94,.15)',  '#fb7185'],
  Other:        ['rgba(100,116,139,.15)','#94a3b8'],
};

export const Badge = ({ label }) => {
  const [bg, color] = BADGE_COLORS[label] || ['var(--bg-elevated)', 'var(--text-2)'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500,
      background: bg, color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
};

/* ── Card ───────────────────────────────────────── */
export const Card = ({ children, style = {}, noPad }) => (
  <div className="fade-up" style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
    padding: noPad ? 0 : 20, ...style,
  }}>{children}</div>
);

/* ── Spinner ────────────────────────────────────── */
export const Spinner = ({ size = 28, color = 'var(--blue)' }) => (
  <div style={{
    width: size, height: size,
    border: `2.5px solid var(--border)`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    flexShrink: 0,
  }} />
);

/* ── Loading overlay ────────────────────────────── */
export const LoadingCenter = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
    <Spinner />
  </div>
);

/* ── Empty state ────────────────────────────────── */
export const EmptyState = ({ icon = '📭', title = 'No data', sub = '' }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-2)' }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: 'var(--text-1)' }}>{title}</div>
    {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
  </div>
);

/* ── Input ──────────────────────────────────────── */
export const Input = ({ label, error, containerStyle = {}, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...containerStyle }}>
    {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>}
    <input {...props} style={{
      width: '100%', padding: '9px 13px',
      background: 'var(--bg-elevated)', border: `1px solid ${error ? 'var(--rose)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-sm)', color: 'var(--text-1)',
      fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
      transition: 'border-color var(--t)',
      ...(props.style || {}),
    }}
      onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,.12)'; }}
      onBlur={e  => { e.target.style.borderColor = error ? 'var(--rose)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    />
    {error && <span style={{ fontSize: 11, color: 'var(--rose)' }}>{error}</span>}
  </div>
);

/* ── Select ─────────────────────────────────────── */
export const Select = ({ label, children, containerStyle = {}, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...containerStyle }}>
    {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>}
    <select {...props} style={{
      width: '100%', padding: '9px 13px',
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)', color: 'var(--text-1)',
      fontSize: 13, fontFamily: 'Inter, sans-serif',
      outline: 'none', cursor: 'pointer',
      ...(props.style || {}),
    }}>
      {children}
    </select>
  </div>
);

/* ── Textarea ───────────────────────────────────── */
export const Textarea = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>}
    <textarea {...props} style={{
      width: '100%', padding: '9px 13px', minHeight: 80, resize: 'vertical',
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)', color: 'var(--text-1)',
      fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
      transition: 'border-color var(--t)',
      ...(props.style || {}),
    }}
      onFocus={e => { e.target.style.borderColor = 'var(--blue)'; }}
      onBlur={e  => { e.target.style.borderColor = 'var(--border)'; }}
    />
  </div>
);

/* ── Modal ──────────────────────────────────────── */
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 500 }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(5px)',
      }} />
      <div className="fade-up" style={{
        position: 'relative', width: '100%', maxWidth,
        maxHeight: '92vh', overflowY: 'auto',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px 14px',
          borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          zIndex: 1,
        }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, letterSpacing: '-.02em' }}>
            {title}
          </h3>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-2)', cursor: 'pointer',
            fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  );
};

/* ── Confirm Dialog ─────────────────────────────── */
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Confirm', message, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={380}>
    <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>{message}</p>
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} disabled={loading}>
        {loading ? 'Deleting…' : 'Delete'}
      </Button>
    </div>
  </Modal>
);

/* ── Pagination ─────────────────────────────────── */
export const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total } = pagination;
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 2px', flexWrap: 'wrap', gap: 10 }}>
      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
        {total} total record{total !== 1 ? 's' : ''}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="ghost" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>← Prev</Button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPageChange(p)} style={{
            width: 32, height: 32, borderRadius: 7, border: '1px solid var(--border)',
            background: p === page ? 'var(--grad-primary)' : 'var(--bg-elevated)',
            color: p === page ? '#fff' : 'var(--text-2)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>{p}</button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= pages}>Next →</Button>
      </div>
    </div>
  );
};
