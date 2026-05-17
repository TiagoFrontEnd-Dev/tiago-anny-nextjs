'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore'

import { db } from '../../lib/firebase'

import Hero from '../../components/Hero'
import LoveCounter from '../../components/LoveCounter'
import SecretLetters from '../../components/SecretLetters'
import Timeline from '../../components/Timeline'
import LoveButton from '../../components/LoveButton'

export default function HomePage() {
  const router = useRouter()

  const [memories, setMemories] = useState([])
  const [role, setRole] = useState('')

  useEffect(() => {
    const savedRole = localStorage.getItem('role')

    if (!savedRole) {
      router.push('/')
      return
    }

    setRole(savedRole)

    async function loadMemories() {
      try {
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
      } catch (err) {
        console.log(err)
      }
    }

    loadMemories()
  }, [router])

  return (
    <main className="vintage-page">
      {role === 'admin' && (
        <button
          className="back-admin-button"
          onClick={() => router.push('/admin')}
        >
          ← Voltar ao Painel
        </button>
      )}

      <Hero />

      <LoveCounter />

      <SecretLetters />

      <Timeline memories={memories} />

      <LoveButton />
    </main>
  )
}