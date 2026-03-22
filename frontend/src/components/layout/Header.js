import React from 'react';
import { useLocation } from 'react-router-dom';

const TITLES = {
  '/dashboard': ['Dashboard',       'Overview of your pipeline'],
  '/leads':     ['Lead Management', 'Track, add and manage leads'],
  '/contacts':  ['Contacts',        'Contacted & converted clients'],
  '/analytics': ['Analytics',       'Charts and performance metrics'],
};

const MenuIcon = ({ open }) => open ? (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
) : (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export default function Header({ mobileOpen, onToggleMobile }) {
  const { pathname } = useLocation();
  const [title, sub] = TITLES[pathname] || ['CRM', ''];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 'var(--header-h)',
      background: 'var(--bg-surface)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 22px', gap: 14,
    }}>
      {/* Mobile hamburger */}
      <button
        onClick={onToggleMobile}
        className="hamburger"
        style={{
          display: 'none', padding: 7, borderRadius: 8,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          color: 'var(--text-2)', cursor: 'pointer',
        }}
      >
        <MenuIcon open={mobileOpen} />
      </button>

      <div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700,
          letterSpacing: '-.02em', lineHeight: 1.2,
          color: 'var(--text-1)',
        }}>
          {title}
        </h1>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{sub}</p>
      </div>

      <div style={{ marginLeft: 'auto' }}>
        <div style={{
          fontSize: 12, color: 'var(--text-3)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: '4px 13px',
        }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .hamburger { display: flex !important; } }
      `}</style>
    </header>
  );
}