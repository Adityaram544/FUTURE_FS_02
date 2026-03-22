import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const IC = {
  grid: (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  users: (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  phone: (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.03 6.03l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  chart: (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  sun: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const NAV = [
  { to: '/dashboard', label: 'Dashboard',  icon: IC.grid  },
  { to: '/leads',     label: 'Leads',      icon: IC.users },
  { to: '/contacts',  label: 'Contacts',   icon: IC.phone },
  { to: '/analytics', label: 'Analytics',  icon: IC.chart },
];

export default function Sidebar({ theme, toggleTheme, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(3px)',
          zIndex: 98,
        }} />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 'var(--sidebar-w)',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        zIndex: 99,
        transition: 'transform var(--t)',
      }}
        className={`sidebar ${mobileOpen ? 'open' : ''}`}
      >
        {/* Brand */}
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: 15,
            flexShrink: 0,
          }}>C</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '-.02em' }}>
              CRM<span style={{ color: 'var(--blue)' }}>Pro</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Lead Management
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '.09em', textTransform: 'uppercase', padding: '4px 8px 8px', fontWeight: 600 }}>
            Navigation
          </div>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                marginBottom: 2, textDecoration: 'none',
                fontWeight: isActive ? 600 : 400, fontSize: 13,
                color: isActive ? 'var(--blue)' : 'var(--text-2)',
                background: isActive ? 'rgba(59,130,246,.1)' : 'transparent',
                transition: 'all var(--t)',
                position: 'relative',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span style={{
                      position: 'absolute', left: 0, top: '18%', height: '64%',
                      width: 3, borderRadius: '0 3px 3px 0',
                      background: 'var(--blue)',
                    }} />
                  )}
                  <span style={{ color: 'inherit' }}>{icon}</span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user + controls */}
        <div style={{ padding: '10px 10px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-elevated)', marginBottom: 8,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: '#fff', fontSize: 12, flexShrink: 0,
            }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Admin</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={toggleTheme} title="Toggle theme" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '7px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-2)', cursor: 'pointer', fontSize: 12, transition: 'all var(--t)',
            }}>
              {theme === 'dark' ? IC.sun : IC.moon}
            </button>
            <button onClick={logout} title="Logout" style={{
              flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '7px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(244,63,94,.07)', border: '1px solid rgba(244,63,94,.2)',
              color: 'var(--rose)', cursor: 'pointer', fontSize: 12, transition: 'all var(--t)',
            }}>
              {IC.logout} Logout
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .sidebar { transform: translateX(0); }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
