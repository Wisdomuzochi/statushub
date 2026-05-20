export default function Header({ onAdd }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      background: 'var(--bg-primary)',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 10, height: 10,
          borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: '0 0 8px var(--green)',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{
          fontFamily: 'JetBrains Mono',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '0.05em',
        }}>
          STATUS<span style={{ color: 'var(--green)' }}>HUB</span>
        </span>
      </div>

      <button onClick={onAdd} style={{
        background: 'transparent',
        border: '1px solid var(--green)',
        color: 'var(--green)',
        padding: '0.4rem 1rem',
        borderRadius: '4px',
        fontFamily: 'JetBrains Mono',
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => e.target.style.background = 'var(--green-dim)'}
        onMouseLeave={e => e.target.style.background = 'transparent'}
      >
        + Ajouter un service
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </header>
  )
}