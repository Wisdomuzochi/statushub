import { useState } from 'react'

export default function AddService({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [url, setUrl]   = useState('')

  const inputStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    padding: '0.6rem 0.8rem',
    borderRadius: '4px',
    fontFamily: 'JetBrains Mono',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%',
  }

  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) return
    onAdd({ name: name.trim(), url: url.trim() })
    setName('')
    setUrl('')
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000000aa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
    }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '1.5rem',
          width: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{
          fontFamily: 'JetBrains Mono',
          fontWeight: 700,
          color: 'var(--green)',
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
        }}>
          + NOUVEAU SERVICE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{
            fontSize: '0.65rem',
            fontFamily: 'JetBrains Mono',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>
            NOM
          </label>
          <input
            style={inputStyle}
            placeholder="Mon API"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{
            fontSize: '0.65rem',
            fontFamily: 'JetBrains Mono',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>
            URL
          </label>
          <input
            style={inputStyle}
            placeholder="https://mon-api.com/health"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}>
            annuler
          </button>
          <button onClick={handleSubmit} style={{
            background: 'var(--green-dim)',
            border: '1px solid var(--green)',
            color: 'var(--green)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontWeight: 700,
          }}>
            ajouter →
          </button>
        </div>
      </div>
    </div>
  )
}