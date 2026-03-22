import React, { useMemo, useState, useEffect, useRef } from 'react';
import { LoadingCenter } from '../components/common';
import api from '../utils/api';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const SRC_COLORS  = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#f43f5e','#06b6d4'];
const STAT_COLORS = ['#3b82f6','#f59e0b','#8b5cf6','#10b981','#f43f5e'];
const ALL_SOURCES = ['Website','Referral','Social Media','Email','Cold Call','Other'];
const DATE_RANGES = [{ label:'7d', value:7 }, { label:'30d', value:30 }, { label:'90d', value:90 }];

const TOOLTIP = {
  backgroundColor:'#161b26', titleColor:'#e2e8f5', bodyColor:'#7e8fa8',
  borderColor:'#1e2536', borderWidth:1, padding:10, cornerRadius:8,
};
const GRID = 'rgba(255,255,255,.04)';
const TICK = '#4a566b';

/* ── Imperative chart hook — updates in place, zero remount ── */
function useChart(canvasRef, buildConfig) {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    if (chartRef.current) {
      const cfg = buildConfig();
      const ch  = chartRef.current;
      ch.data.labels = cfg.data.labels;
      ch.data.datasets.forEach((ds, i) => {
        const src = cfg.data.datasets[i];
        if (src) Object.assign(ds, src);
      });
      ch.update('none');
    } else {
      chartRef.current = new Chart(ctx, buildConfig());
    }
  });

  useEffect(() => {
    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, []);
}

/* ── Chart components ──────────────────────────────────────── */
function LineChart({ data }) {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: 'line', data,
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false }, tooltip: TOOLTIP },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, maxRotation: 0 } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } }, beginAtZero: true },
      },
    },
  }));
  return <canvas ref={ref} />;
}

function DonutChart({ data }) {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: 'doughnut', data,
    options: {
      responsive: true, maintainAspectRatio: false, animation: false, cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#7e8fa8', font: { size: 11 }, usePointStyle: true, pointStyleWidth: 7, padding: 12, boxHeight: 8 },
        },
        tooltip: TOOLTIP,
      },
    },
  }));
  return <canvas ref={ref} />;
}

function BarChart({ data }) {
  const ref = useRef(null);
  useChart(ref, () => ({
    type: 'bar', data,
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false }, tooltip: TOOLTIP },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } } },
        y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 } }, beginAtZero: true },
      },
    },
  }));
  return <canvas ref={ref} />;
}

/* ── UI atoms ──────────────────────────────────────────────── */
const Pill = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '5px 13px', borderRadius: 20, fontSize: 12, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap',
    border: active ? 'none' : '1px solid var(--border)',
    background: active ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'var(--bg-elevated)',
    color: active ? '#fff' : 'var(--text-2)',
  }}>{children}</button>
);

const Kpi = ({ label, value, color, sub }) => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '16px 14px', textAlign: 'center',
  }}>
    <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 24, fontWeight: 800, color, letterSpacing: '-.03em', lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>{sub}</div>}
  </div>
);

const ChartBox = ({ title, height = 220, children }) => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '18px 20px',
  }}>
    <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text-1)' }}>
      {title}
    </div>
    <div style={{ height, position: 'relative' }}>{children}</div>
  </div>
);

const SectionLabel = ({ children }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, color: 'var(--text-3)',
    textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap',
  }}>{children}</span>
);

/* ── Page ──────────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [days,         setDays]         = useState(30);
  const [sourceFilter, setSourceFilter] = useState('All');
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    api.get('/api/leads/stats/summary')
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredDaily = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days - 1));
    return (stats?.daily || []).filter(r => new Date(r._id) >= cutoff);
  }, [stats?.daily, days]);

  const filteredBySource = useMemo(() => {
    if (sourceFilter === 'All') return stats?.bySource || [];
    return (stats?.bySource || []).filter(s => s._id === sourceFilter);
  }, [stats?.bySource, sourceFilter]);

  const lineData = useMemo(() => {
    const dateRange = Array.from({ length: days }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
      return d.toISOString().slice(0, 10);
    });
    const map = {};
    filteredDaily.forEach(r => { map[r._id] = r.count; });
    const step = days <= 7 ? 1 : days <= 30 ? 5 : 15;
    return {
      labels: dateRange.map((d, i) => {
        const dt = new Date(d);
        return i % step === 0
          ? dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
          : '';
      }),
      datasets: [{
        label: 'Leads',
        data: dateRange.map(d => map[d] || 0),
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,.08)',
        tension: 0.4,
        pointRadius: days <= 7 ? 2 : 0,
        pointHoverRadius: 4,
        pointBackgroundColor: '#3b82f6',
        borderWidth: 2,
      }],
    };
  }, [filteredDaily, days]);

  const donutData = useMemo(() => ({
    labels: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
    datasets: [{
      data: [
        stats?.newCount  || 0,
        stats?.contacted || 0,
        stats?.qualified || 0,
        stats?.converted || 0,
        stats?.lost      || 0,
      ],
      backgroundColor: STAT_COLORS.map(c => c + 'bb'),
      borderColor: STAT_COLORS, borderWidth: 2, hoverOffset: 6,
    }],
  }), [stats?.newCount, stats?.contacted, stats?.qualified, stats?.converted, stats?.lost]);

  const barData = useMemo(() => ({
    labels: filteredBySource.map(s => s._id),
    datasets: [{
      label: 'Leads',
      data: filteredBySource.map(s => s.count),
      backgroundColor: filteredBySource.map((_, i) => SRC_COLORS[i % SRC_COLORS.length] + 'aa'),
      borderColor:     filteredBySource.map((_, i) => SRC_COLORS[i % SRC_COLORS.length]),
      borderWidth: 1, borderRadius: 6,
    }],
  }), [filteredBySource]);

  const totalInPeriod = filteredDaily.reduce((s, r) => s + r.count, 0);
  const convRate  = stats?.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : '0.0';
  const lostRate  = stats?.total > 0 ? ((stats.lost      / stats.total) * 100).toFixed(1) : '0.0';
  const isFiltered = days !== 30 || sourceFilter !== 'All';

  if (loading) return <LoadingCenter />;

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Filter bar ─────────────────────────────── */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>

        {/* Period */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <SectionLabel>Period</SectionLabel>
          <div style={{ display: 'flex', gap: 6 }}>
            {DATE_RANGES.map(r => (
              <Pill key={r.value} active={days === r.value} onClick={() => setDays(r.value)}>
                {r.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)' }} />

        {/* Source */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <SectionLabel style={{ paddingTop: 5 }}>Source</SectionLabel>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            <Pill active={sourceFilter === 'All'} onClick={() => setSourceFilter('All')}>All</Pill>
            {ALL_SOURCES.map(s => (
              <Pill key={s} active={sourceFilter === s} onClick={() => setSourceFilter(s)}>{s}</Pill>
            ))}
          </div>
        </div>

        {/* Reset */}
        {isFiltered && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { setDays(30); setSourceFilter('All'); }}
              style={{
                fontSize: 11, color: 'var(--rose)',
                background: 'rgba(244,63,94,.08)', border: '1px solid rgba(244,63,94,.2)',
                borderRadius: 20, padding: '5px 14px', cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontWeight: 500,
              }}
            >✕ Reset filters</button>
          </div>
        )}
      </div>

      {/* ── KPI cards ──────────────────────────────── */}
      <div className="a-kpi">
        <Kpi label={`Leads (${days}d)`} value={totalInPeriod}           color="var(--blue)"   sub="selected period" />
        <Kpi label="Conversion Rate"     value={`${convRate}%`}          color="var(--green)"  sub="all time" />
        <Kpi label="Lost Rate"           value={`${lostRate}%`}          color="var(--rose)"   sub="all time" />
        <Kpi label="Active Sources"      value={filteredBySource.length} color="var(--violet)" sub={sourceFilter !== 'All' ? sourceFilter : 'all channels'} />
      </div>

      {/* ── Line chart ─────────────────────────────── */}
      <ChartBox
        title={`Lead volume — last ${days} days${sourceFilter !== 'All' ? ` · ${sourceFilter}` : ''}`}
        height={190}
      >
        <LineChart data={lineData} />
      </ChartBox>

      {/* ── Donut + Bar ────────────────────────────── */}
      <div className="a-two">
        <ChartBox title="Status distribution" height={250}>
          <DonutChart data={donutData} />
        </ChartBox>
        <ChartBox title={`By source${sourceFilter !== 'All' ? ` · ${sourceFilter}` : ''}`} height={250}>
          {filteredBySource.length === 0 ? (
            <div style={{
              height: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-3)', fontSize: 13, gap: 8,
            }}>
              <span style={{ fontSize: 28 }}>📊</span>
              No data for this source
            </div>
          ) : (
            <BarChart data={barData} />
          )}
        </ChartBox>
      </div>

      <style>{`
        .a-kpi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .a-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 720px) { .a-kpi { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) {
          .a-kpi { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .a-two { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}