'use client'

import { useState } from 'react'

export default function LoveButton() {
  const [open, setOpen] = useState(false)

  return (
    <section className="love-area">
      <button
        className="love-button"
        onClick={() => setOpen(true)}
      >
        ❤️ EU TE AMO
      </button>

      {open && (
        <div
          className="modal"
          onClick={() => setOpen(false)}
        >
          <div className="heart">
            ❤️ Eu te amo ❤️
          </div>
        </div>
      )}
    </section>
  )
}