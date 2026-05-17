'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  query
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

export default function CartasAdminPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [openDate, setOpenDate] = useState('')

  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(false)

  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem('role')

    if (role !== 'admin') {
      router.push('/')
      return
    }

    loadLetters()
  }, [router])

  async function loadLetters() {
    const q = query(collection(db, 'letters'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    setLetters(data)
  }

  function resetForm() {
    setTitle('')
    setText('')
    setOpenDate('')
    setEditingId(null)
  }

  function startEdit(letter) {
    setEditingId(letter.id)
    setTitle(letter.title || '')
    setText(letter.text || '')
    setOpenDate(letter.openDate || '')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!title || !text) {
      alert('Preencha título e texto da carta')
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        await updateDoc(doc(db, 'letters', editingId), {
          title,
          text,
          openDate,
          updatedAt: new Date()
        })

        alert('Carta atualizada 💌')
      } else {
        await addDoc(collection(db, 'letters'), {
          title,
          text,
          openDate,
          createdAt: new Date()
        })

        alert('Carta criada 💌')
      }

      resetForm()
      loadLetters()
    } catch (err) {
      console.log(err)
      alert('Erro ao salvar carta')
    }

    setLoading(false)
  }

  async function handleDelete(letter) {
    const confirmDelete = confirm('Tem certeza que deseja excluir essa carta?')

    if (!confirmDelete) return

    try {
      await deleteDoc(doc(db, 'letters', letter.id))
      alert('Carta excluída')
      loadLetters()
    } catch (err) {
      console.log(err)
      alert('Erro ao excluir carta')
    }
  }

  function logout() {
    localStorage.removeItem('role')
    router.push('/')
  }

  return (
    <div className="admin-page vintage-admin">
      <div className="admin-box">
        <div className="admin-top">
          <div>
            <h1>Cartas Secretas 💌</h1>
            <p>escreva cartas, cápsulas do tempo e mensagens especiais.</p>
          </div>

          <button onClick={logout}>
            Sair
          </button>
        </div>

        <div className="admin-menu">
          <button onClick={() => router.push('/admin')}>
            Painel
          </button>

          <button onClick={() => router.push('/admin/cartas')}>
            Cartas
          </button>

          <button onClick={() => router.push('/home')}>
            Ver Página Principal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <h2>
            {editingId ? 'Editar Carta' : 'Nova Carta'}
          </h2>

          <input
            type="text"
            placeholder="Título da carta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            value={openDate}
            onChange={(e) => setOpenDate(e.target.value)}
          />

          <textarea
            placeholder="Escreva sua carta..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button type="submit">
            {loading
              ? 'Salvando...'
              : editingId
                ? 'Salvar Alterações'
                : 'Salvar Carta'}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-edit"
              onClick={resetForm}
            >
              Cancelar edição
            </button>
          )}
        </form>

        <div className="admin-list">
          <h2>Cartas salvas</h2>

          {letters.length === 0 && (
            <p className="admin-empty">
              Nenhuma carta criada ainda.
            </p>
          )}

          {letters.map((letter) => (
            <div key={letter.id} className="admin-memory letter-admin-card">
              <h3>{letter.title}</h3>

              {letter.openDate && (
                <span className="letter-date">
                  Abrir em: {letter.openDate}
                </span>
              )}

              <p>{letter.text}</p>

              <div className="admin-actions">
                <button onClick={() => startEdit(letter)}>
                  Editar
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(letter)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}