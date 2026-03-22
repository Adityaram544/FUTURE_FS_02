import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="main-content" style={{
        flex: 1,
        marginLeft: 'var(--sidebar-w)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Header mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen(o => !o)} />
        <main style={{ flex: 1, padding: '22px', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
