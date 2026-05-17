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

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

import { db, storage } from '../../lib/firebase'

export default function AdminPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const [file, setFile] = useState(null)

  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editingMemory, setEditingMemory] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem('role')

    if (role !== 'admin') {
      router.push('/')
      return
    }

    loadMemories()
  }, [router])

  async function loadMemories() {
    const q = query(collection(db, 'memories'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    setMemories(data)
  }

  function resetForm() {
    setTitle('')
    setText('')
    setDate('')
    setFile(null)
    setEditingId(null)
    setEditingMemory(null)
  }

  function startEdit(memory) {
    setEditingId(memory.id)
    setEditingMemory(memory)
    setTitle(memory.title || '')
    setText(memory.text || '')
    setDate(memory.date || '')
    setFile(null)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!title || !text) {
      alert('Preencha título e texto')
      return
    }

    setLoading(true)

    try {
      let imageUrl = editingMemory?.image || ''
      let videoUrl = editingMemory?.video || ''
      let filePath = editingMemory?.filePath || ''

      if (file) {
        if (editingMemory?.filePath) {
          try {
            await deleteObject(ref(storage, editingMemory.filePath))
          } catch (err) {
            console.log('Arquivo antigo não encontrado:', err)
          }
        }

        filePath = `memories/${Date.now()}-${file.name}`

        const storageRef = ref(storage, filePath)

        await uploadBytes(storageRef, file)

        const fileUrl = await getDownloadURL(storageRef)

        imageUrl = file.type.startsWith('image/') ? fileUrl : ''
        videoUrl = file.type.startsWith('video/') ? fileUrl : ''
      }

      if (editingId) {
        await updateDoc(doc(db, 'memories', editingId), {
          title,
          text,
          date,
          image: imageUrl,
          video: videoUrl,
          filePath,
          updatedAt: new Date()
        })

        alert('Memória atualizada ❤️')
      } else {
        if (!file) {
          alert('Escolha uma foto ou vídeo')
          setLoading(false)
          return
        }

        await addDoc(collection(db, 'memories'), {
          title,
          text,
          date,
          image: imageUrl,
          video: videoUrl,
          filePath,
          createdAt: new Date()
        })

        alert('Memória publicada ❤️')
      }

      resetForm()
      loadMemories()
    } catch (err) {
      console.log(err)
      alert('Erro ao salvar memória')
    }

    setLoading(false)
  }

  async function handleDelete(memory) {
    const confirmDelete = confirm('Tem certeza que deseja excluir essa memória?')

    if (!confirmDelete) return

    try {
      await deleteDoc(doc(db, 'memories', memory.id))

      if (memory.filePath) {
        try {
          await deleteObject(ref(storage, memory.filePath))
        } catch (err) {
          console.log('Arquivo já removido:', err)
        }
      }

      alert('Memória excluída')
      loadMemories()
    } catch (err) {
      console.log(err)
      alert('Erro ao excluir')
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
            <h1>Painel Admin ❤️</h1>
            <p>adicione, edite e organize as memórias de vocês.</p>
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
            {editingId ? 'Editar Memória' : 'Adicionar Memória'}
          </h2>

          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Título da memória"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Texto da memória"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button type="submit">
            {loading
              ? 'Salvando...'
              : editingId
                ? 'Salvar Alterações'
                : 'Publicar Memória'}
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
          <h2>Memórias publicadas</h2>

          {memories.map((memory) => (
            <div key={memory.id} className="admin-memory">
              {memory.image && (
                <img src={memory.image} alt={memory.title} />
              )}

              {memory.video && (
                <video src={memory.video} controls />
              )}

              <h3>{memory.title}</h3>
              <p>{memory.text}</p>

              <div className="admin-actions">
                <button onClick={() => startEdit(memory)}>
                  Editar
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(memory)}
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