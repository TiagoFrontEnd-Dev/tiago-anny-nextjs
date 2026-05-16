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
import Timeline from '../../components/Timeline'
import LoveButton from '../../components/LoveButton'
import SpotifyPlayer from '../../components/SpotifyPlayer'

export default function HomePage() {
  const router = useRouter()

  const [memories, setMemories] = useState([])

  useEffect(() => {
    const role = localStorage.getItem('role')

    if (!role) {
      router.push('/')
      return
    }

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

    loadMemories()
  }, [router])

  return (
    <main>
      <Hero />

      <SpotifyPlayer />

      <Timeline memories={memories} />

      <LoveButton />
    </main>
  )
}