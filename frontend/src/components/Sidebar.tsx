import { useEffect, useState } from 'react'
import { listConversations } from '../api/chat'

type Props = {
  token?: string
  user?: { id: number; username: string }
  onSelectConversation: (id?: number) => void
}

function Sidebar({ token, user, onSelectConversation }: Props) {
  const [convs, setConvs] = useState<Array<any>>([])

  useEffect(() => {
    if (!token || !user) return
    ;(async () => {
      try {
        const items = await listConversations(user.id, token)
        setConvs(items)
      } catch (err) {
        console.error('failed to load convs', err)
      }
    })()
  }, [token, user])

  const handleNewAnon = () => {
    // clear local messages and select anonymous conversation (undefined)
    localStorage.removeItem('local_chat_msgs')
    onSelectConversation(undefined)
  }

  return (
    <div className="sidebar">
      <h4>Conversaciones</h4>
      {token && user ? (
        <div className="sidebar-list">
          {convs.length === 0 && <div className="sidebar-empty">No hay conversaciones</div>}
          {convs.map((c) => (
            <button key={c.id} className="sidebar-item" onClick={() => onSelectConversation(c.id)}>
              {c.title || `Conversación ${c.id}`}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="sidebar-empty">Chatea anónimamente o inicia sesión para guardar conversaciones.</div>
          <div className="sidebar-actions">
            <button onClick={handleNewAnon}>Nueva conversación anónima</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
