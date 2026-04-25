import { useState } from 'react'
import { login, register } from '../api/auth'

type Props = {
  onLogin: (token: string) => void
}

function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (mode === 'register') {
        await register(username, password)
        // after register, auto-login
      }
      const data = await login(username, password)
      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token)
        onLogin(data.access_token)
      }
    } catch (err: any) {
      setError(err.message || 'Auth error')
    }
  }

  return (
    <div className="login-box">
      <h3>{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="usuario" />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="contraseña" />
        </div>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <div style={{ marginTop: 8 }}>
          <button type="submit">{mode === 'login' ? 'Entrar' : 'Registrar y entrar'}</button>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginLeft: 8 }}>
            {mode === 'login' ? 'Crear cuenta' : 'Tengo cuenta'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
