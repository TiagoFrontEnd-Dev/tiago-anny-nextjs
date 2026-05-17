'use client'

import { useEffect, useState } from 'react'

import {
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore'

import { db } from '../lib/firebase'

export default function SecretLetters() {
  const [letters, setLetters] = useState([])
  const [openLetters, setOpenLetters] = useState(false)

  useEffect(() => {
    async function loadLetters() {
      try {
        const q = query(
          collection(db, 'letters'),
          orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setLetters(data)
      } catch (err) {
        console.log(err)
      }
    }

    loadLetters()
  }, [])

  return (
    <section
      id="cartas-secretas"
      className="secret-letters-section"
    >
      <div className="secret-header">
        <div>
          <h2>Cartas Secretas 💌</h2>

          <p className="secret-letters-subtitle">
            mensagens guardadas como páginas antigas da nossa história.
          </p>
        </div>

        <button
          className="open-letters-button"
          onClick={() => setOpenLetters(!openLetters)}
        >
          {openLetters
            ? 'Fechar Cartas'
            : `Abrir Cartas (${letters.length})`}
        </button>
      </div>

      {!openLetters && (
        <div className="letters-locked">
          <div className="locked-envelope">
            💌
          </div>

          <p>
            Existem cartas secretas esperando para serem abertas.
          </p>
        </div>
      )}

      {openLetters && (
        <>
          {letters.length === 0 && (
            <p className="empty-message">
              Ainda não há cartas secretas.
            </p>
          )}

          <div className="secret-letters-grid">
            {letters.map((letter) => (
              <article
                key={letter.id}
                className="secret-letter-card"
              >
                <span>
                  {letter.openDate
                    ? `Abrir em: ${letter.openDate}`
                    : 'Carta liberada'}
                </span>

                <h3>{letter.title}</h3>

                <p>{letter.text}</p>

                <small>
                  Com amor, Tiago & Anny
                </small>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}