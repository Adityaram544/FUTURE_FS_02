import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', padding: 16,
      backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,.08) 0%, transparent 70%)',
    },
    card: {
      width: '100%', maxWidth: 400,
      background: 'var(--bg-surface)', border: '1px solid var(--border-light)',
      borderRadius: 20, padding: '36px 32px',
      boxShadow: '0 20px 60px rgba(0,0,0,.5)',
    },
    logo: {
      width: 44, height: 44, borderRadius: 12,
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', fontWeight: 800, color: '#fff', fontSize: 20,
      margin: '0 auto 20px',
    },
    title: {
      fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 800,
      textAlign: 'center', letterSpacing: '-.03em',
      color: 'var(--text-1)', marginBottom: 6,
    },
    sub: { fontSize: 13, color: 'var(--text-2)', textAlign: 'center', marginBottom: 28 },
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 },
    input: {
      width: '100%', padding: '10px 14px',
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 9, color: 'var(--text-1)', fontSize: 14,
      fontFamily: 'Inter, sans-serif', outline: 'none',
      transition: 'border-color .15s, box-shadow .15s',
    },
    btn: {
      width: '100%', padding: '11px',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: '#fff', border: 'none', borderRadius: 9,
      fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? .7 : 1,
      boxShadow: '0 4px 16px rgba(139,92,246,.35)',
      marginTop: 22, transition: 'opacity .15s',
    },
    hint: {
      marginTop: 20, padding: 14,
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 9,
    },
    hintRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 },
  };

  return (
    <div style={s.page}>
      <div style={s.card} className="fade-up">
        <div style={s.logo}>C</div>
        <h1 style={s.title}>CRM<span style={{ color:'var(--blue)' }}>Pro</span></h1>
        <p style={s.sub}>Sign in to your dashboard</p>

        <form onSubmit={handle}>
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>Email address</label>
            <input
              style={s.input} type="email" required placeholder="admin@crm.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onFocus={e => { e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,.12)'; }}
              onBlur={e  => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; }}
            />
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={s.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...s.input, paddingRight: 44 }}
                type={showPass ? 'text' : 'password'}
                required placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onFocus={e => { e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,.12)'; }}
                onBlur={e  => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none'; }}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4,
              }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div style={s.hint}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Default Credentials
          </div>
          <div style={s.hintRow}><span style={{ color: 'var(--text-2)' }}>Email</span><span style={{ color: 'var(--blue)', fontFamily: 'monospace' }}>admin@crm.com</span></div>
          <div style={{ ...s.hintRow, marginBottom: 0 }}><span style={{ color: 'var(--text-2)' }}>Password</span><span style={{ color: 'var(--blue)', fontFamily: 'monospace' }}>Admin@123</span></div>
        </div>
      </div>
    </div>
  );
}
