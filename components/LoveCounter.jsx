'use client'

import { useEffect, useState } from 'react'

export default function LoveCounter() {
  const startDate = new Date('2025-12-19T00:00:00')

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    function updateCounter() {
      const now = new Date()
      const diff = now - startDate

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTime({
        days,
        hours,
        minutes,
        seconds
      })
    }

    updateCounter()

    const interval = setInterval(updateCounter, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="love-counter-section">
      <div className="love-counter-paper">
        <p className="counter-small">nossa história começou em</p>

        <h2> 19 de Dezembro de 2025</h2>

        <p className="counter-text">
          Estamos escrevendo nossa história há:
        </p>

        <div className="counter-grid">
          <div>
            <strong>{time.days}</strong>
            <span>dias</span>
          </div>

          <div>
            <strong>{time.hours}</strong>
            <span>horas</span>
          </div>

          <div>
            <strong>{time.minutes}</strong>
            <span>minutos</span>
          </div>

          <div>
            <strong>{time.seconds}</strong>
            <span>segundos</span>
          </div>
        </div>

        <p className="counter-footer">
          cada segundo valeu a pena. ♡
        </p>
      </div>

      <style jsx>{`
        .love-counter-section{
          max-width:1000px;
          margin:0 auto;
          padding:90px 20px 50px;
        }

        .love-counter-paper{
          position:relative;
          background:
            linear-gradient(
              rgba(247,225,185,.94),
              rgba(210,166,105,.88)
            );
          color:#3b2418;
          padding:45px;
          border-radius:16px;
          text-align:center;
          border:1px solid rgba(92,52,28,.32);
          box-shadow:
            0 25px 60px rgba(0,0,0,.45),
            inset 0 0 50px rgba(83,45,21,.16);
        }

        .love-counter-paper::before{
          content:"";
          position:absolute;
          top:-16px;
          left:40px;
          width:130px;
          height:32px;
          background:rgba(176,128,82,.55);
          transform:rotate(-7deg);
          box-shadow:0 4px 12px rgba(0,0,0,.18);
        }

        .counter-small{
          font-style:italic;
          color:#6b3f26;
          margin-bottom:10px;
        }

        .love-counter-paper h2{
          font-size:2.8rem;
          color:#2f1c13;
          margin-bottom:18px;
        }

        .counter-text{
          font-size:1.2rem;
          margin-bottom:30px;
        }

        .counter-grid{
          display:grid;
          grid-template-columns:repeat(4, 1fr);
          gap:18px;
        }

        .counter-grid div{
          background:rgba(255,244,222,.55);
          padding:22px 12px;
          border-radius:14px;
          border:1px solid rgba(92,52,28,.18);
        }

        .counter-grid strong{
          display:block;
          font-size:2.6rem;
          color:#7c382d;
        }

        .counter-grid span{
          display:block;
          margin-top:6px;
          font-size:.95rem;
        }

        .counter-footer{
          margin-top:28px;
          font-style:italic;
          color:#6b3f26;
          font-size:1.2rem;
        }

        @media(max-width:768px){
          .love-counter-paper{
            padding:34px 22px;
          }

          .love-counter-paper h2{
            font-size:2rem;
          }

          .counter-grid{
            grid-template-columns:repeat(2, 1fr);
          }

          .counter-grid strong{
            font-size:2.1rem;
          }
        }
      `}</style>
    </section>
  )
}
