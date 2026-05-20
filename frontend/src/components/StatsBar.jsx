export default function StatsBar({ services }) {
  const up = services.filter(s => s.status === 'up').length
  const down = services.filter(s => s.status === 'down').length
  const unknown = services.filter(s => s.status === 'unknown').length
  const total = services.length

  const uptimePct = total === 0 ? 100
    : Math.round((up / total) * 100)

  return (
    <div style={{
      display: 'flex',
      gap: '1px',
      background: 'var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      {[
        { label: 'OPÉRATIONNELS', value: up,      color: 'var(--green)'  },
        { label: 'EN PANNE',      value: down,     color: 'var(--red)'    },
        { label: 'INCONNUS',      value: unknown,  color: 'var(--yellow)' },
        { label: 'UPTIME GLOBAL', value: `${uptimePct}%`, color: 'var(--accent)' },
      ].map(({ label, value, color }) => (
        <div key={label} style={{
          flex: 1,
          background: 'var(--bg-secondary)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          <span style={{
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono',
          }}>
            {label}
          </span>
          <span style={{
            fontSize: '1.8rem',
            fontWeight: 600,
            color,
            fontFamily: 'JetBrains Mono',
          }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}