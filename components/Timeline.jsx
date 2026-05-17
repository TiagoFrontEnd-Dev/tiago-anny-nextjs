export default function Timeline({ memories }) {
  return (
    <section className="timeline vintage-timeline">
      <h2>Linha do Tempo</h2>

      <p className="timeline-intro">
        nossas memórias favoritas, guardadas como cartas antigas.
      </p>

      <div className="letters-grid">
        {memories.length === 0 && (
          <p className="empty-message">
            Ainda não há memórias publicadas.
          </p>
        )}

        {memories.map((memory, index) => (
          <article
            key={memory.id}
            className={`memory-letter letter-tilt-${index % 4}`}
          >
            <div className="letter-stamp">
              {memory.date || 'sem data'}
            </div>

            <div className="letter-media">
              {memory.image && (
                <img src={memory.image} alt={memory.title} />
              )}

              {memory.video && (
                <video src={memory.video} controls />
              )}
            </div>

            <div className="letter-content">
              <h3>{memory.title}</h3>
              <p>{memory.text}</p>
            </div>

            <div className="letter-signature">
              Tiago & Anny
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}