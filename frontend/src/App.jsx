import { useState, useEffect } from 'react'
import axios from 'axios'
import Header     from './components/Header'
import StatsBar   from './components/StatsBar'
import ServiceCard from './components/ServiceCard'
import AddService  from './components/AddService'

const API = 'http://localhost:8000'

export default function App() {
  const [services, setServices]   = useState([])
  const [showAdd, setShowAdd]     = useState(false)
  const [loading, setLoading]     = useState(true)

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API}/api/services/`)
      setServices(res.data)
    } catch (err) {
      console.error('Erreur API:', err)
    } finally {
      setLoading(false)
    }
  }

  // Rafraîchit toutes les 30 secondes
  useEffect(() => {
    fetchServices()
    const interval = setInterval(fetchServices, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleAdd = async ({ name, url }) => {
    try {
      await axios.post(`${API}/api/services/`, { name, url })
      fetchServices()
    } catch (err) {
      alert(err.response?.data?.detail || 'Erreur lors de l\'ajout')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/services/${id}`)
      fetchServices()
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header onAdd={() => setShowAdd(true)} />
      <StatsBar services={services} />

      <main style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono',
            padding: '4rem',
          }}>
            Chargement...
          </div>
        ) : services.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono',
            padding: '4rem',
            border: '1px dashed var(--border)',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⬡</div>
            <div>Aucun service surveillé</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Clique sur "+ Ajouter un service" pour commencer
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showAdd && (
        <AddService
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}