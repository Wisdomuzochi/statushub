import {
  LineChart, Line, ResponsiveContainer, Tooltip
} from 'recharts'

export default function ServiceCard({ service, onDelete }) {
  const isUp      = service.status === 'up'
  const isDown    = service.status === 'down'
  const isUnknown = service.status === 'unknown'

  const statusColor = isUp ? 'var(--green)'
    : isDown ? 'var(--red)' : 'var(--yellow)'

  const statusBg = isUp ? 'var(--green-dim)'
    : isDown ? 'var(--red-dim)' : 'var(--yellow-dim)'

  const statusLabel = isUp ? 'UP'
    : isDown ? 'DOWN' : 'UNKNOWN'

  // Simule un historique de latence pour le graphique
  const chartData = service.checks
    ? service.checks.map((c, i) => ({
        i,
        ms: c.response_time_ms || 0
      }))
    : []

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border)`,
      borderTop: `2px solid ${statusColor}`,
      borderRadius: '6px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'all 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e =>
        e.currentTarget.style.background = 'var(--bg-card-hover)'}
      onMouseLeave={e =>
        e.currentTarget.style.background = 'var(--bg-card)'}
    >
      {/* En-tête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{
            fontWeight: 600,
            fontSize: '0.95rem',
            marginBottom: '0.2rem',
          }}>
            {service.name}
          </div>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono',
          }}>
            {service.url}
          </div>
        </div>

        <div style={{
          background: statusBg,
          color: statusColor,
          border: `1px solid ${statusColor}`,
          padding: '0.2rem 0.6rem',
          borderRadius: '3px',
          fontSize: '0.7rem',
          fontFamily: 'JetBrains Mono',
          fontWeight: 700,
          letterSpacing: '0.1em',
        }}>
          {statusLabel}
        </div>
      </div>

      {/* Latence */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        fontSize: '0.8rem',
      }}>
        <div>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '0.65rem',
            fontFamily: 'JetBrains Mono',
            letterSpacing: '0.08em',
            marginBottom: '0.2rem',
          }}>
            LATENCE
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono',
            color: statusColor,
            fontWeight: 600,
          }}>
            {service.last_response_time_ms
              ? `${Math.round(service.last_response_time_ms)}ms`
              : '—'}
          </div>
        </div>

        <div>
          <div style={{
            color: 'var(--text-muted)',
            fontSize: '0.65rem',
            fontFamily: 'JetBrains Mono',
            letterSpacing: '0.08em',
            marginBottom: '0.2rem',
          }}>
            DERNIER CHECK
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '0.78rem',
          }}>
            {service.last_check
              ? new Date(service.last_check)
                  .toLocaleTimeString('fr-FR')
              : '—'}
          </div>
        </div>
      </div>

      {/* Graphique latence */}
      {chartData.length > 1 && (
        <div style={{ height: 50 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="ms"
                stroke={statusColor}
                strokeWidth={1.5}
                dot={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontFamily: 'JetBrains Mono',
                }}
                formatter={(v) => [`${v}ms`, 'latence']}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Supprimer */}
      <button
        onClick={() => onDelete(service.id)}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          padding: '0.3rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          cursor: 'pointer',
          fontFamily: 'JetBrains Mono',
          transition: 'all 0.2s',
          alignSelf: 'flex-end',
        }}
        onMouseEnter={e => {
          e.target.style.borderColor = 'var(--red)'
          e.target.style.color = 'var(--red)'
        }}
        onMouseLeave={e => {
          e.target.style.borderColor = 'var(--border)'
          e.target.style.color = 'var(--text-muted)'
        }}
      >
        supprimer
      </button>
    </div>
  )
}