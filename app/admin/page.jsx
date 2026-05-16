'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
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

  useEffect(() => {
    const role = localStorage.getItem('role')

    if (role !== 'admin') {
      router.push('/')
      return
    }

    loadMemories()
  }, [router])

  async function loadMemories() {
    const q = query(
      collection(db, 'memories'),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    setMemories(data)
  }

  async function handleUpload(e) {
    e.preventDefault()

    if (!file) {
      alert('Escolha uma foto ou vídeo')
      return
    }

    setLoading(true)

    try {
      const filePath = `memories/${Date.now()}-${file.name}`

      const storageRef = ref(storage, filePath)

      await uploadBytes(storageRef, file)

      const fileUrl = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'memories'), {
        title,
        text,
        date,
        image: file.type.startsWith('image/') ? fileUrl : '',
        video: file.type.startsWith('video/') ? fileUrl : '',
        filePath,
        createdAt: new Date()
      })

      setTitle('')
      setText('')
      setDate('')
      setFile(null)

      alert('Memória publicada ❤️')

      loadMemories()
    } catch (err) {
      console.log(err)
      alert('Erro ao publicar')
    }

    setLoading(false)
  }

  async function handleDelete(memory) {
    const confirmDelete = confirm('Tem certeza que deseja excluir?')

    if (!confirmDelete) return

    try {
      await deleteDoc(doc(db, 'memories', memory.id))

      if (memory.filePath) {
        const fileRef = ref(storage, memory.filePath)
        await deleteObject(fileRef)
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
    <div className="admin-page">
      <div className="admin-box">
        <div className="admin-top">
          <h1>Painel Admin ❤️</h1>

          <button onClick={logout}>
            Sair
          </button>
        </div>

        <form onSubmit={handleUpload} className="admin-form">
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
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Texto da memória"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button type="submit">
            {loading ? 'Publicando...' : 'Publicar Memória'}
          </button>
        </form>

        <div className="admin-list">
          <h2>Memórias publicadas</h2>

          {memories.map((memory) => (
            <div key={memory.id} className="admin-memory">
              {memory.image && <img src={memory.image} alt={memory.title} />}

              {memory.video && (
                <video src={memory.video} controls />
              )}

              <h3>{memory.title}</h3>
              <p>{memory.text}</p>

              <button onClick={() => handleDelete(memory)}>
                Excluir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}