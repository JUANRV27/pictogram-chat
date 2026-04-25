type MessageOut = {
  id: number
  conversation_id: number
  sender: string
  content: string
  created_at: string
}

function authHeaders(token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
function apiUrl(path: string) {
  if (!path.startsWith('/')) path = '/' + path
  return API_BASE ? `${API_BASE}${path}` : path
}

export async function createConversation(user_id: number, token?: string) {
  const res = await fetch(apiUrl('/api/v1/chat/conversations'), {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ user_id }),
  })
  if (!res.ok) throw new Error('failed to create conversation')
  return res.json()
}

export async function listConversations(user_id: number, token?: string) {
  const res = await fetch(apiUrl(`/api/v1/chat/conversations?user_id=${user_id}`), { headers: authHeaders(token) })
  if (!res.ok) throw new Error('failed to list conversations')
  return res.json()
}

export async function postMessage(conversation_id: number, sender: string, content: string, token?: string): Promise<MessageOut> {
  const res = await fetch(apiUrl('/api/v1/chat/messages'), {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ conversation_id, sender, content }),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || 'failed to post message')
  }
  return res.json()
}

export async function listMessages(conversation_id: number, token?: string) {
  const res = await fetch(apiUrl(`/api/v1/chat/conversations/${conversation_id}/messages`), { headers: authHeaders(token) })
  if (!res.ok) throw new Error('failed to list messages')
  return res.json()
}

