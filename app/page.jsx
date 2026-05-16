'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      if (user.email === 'admin@tiagoanny.com') {
        localStorage.setItem('role', 'admin')
        router.push('/admin')
        return
      }

      localStorage.setItem('role', 'viewer')
      router.push('/home')
    } catch (err) {
      alert('Email ou senha inválidos')
      console.log(err)
    }

    setLoading(false)
  }

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-box">
        <h1>❤️ Tiago & Anny ❤️</h1>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}