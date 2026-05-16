export default function Timeline({ memories }) {
  return (
    <section className="timeline vintage-timeline">
      <h2>Linha do Tempo</h2>

      <p className="timeline-intro">
        nossas memórias favoritas, guardadas como cartas antigas.
      </p>

      <div className="cards">
        {memories.length === 0 && (
          <p className="empty-message">
            Ainda não há memórias publicadas.
          </p>
        )}

        {memories.map((memory, index) => (
          <article
            key={memory.id}
            className={`card polaroid-card rotate-${index % 4}`}
          >
            {memory.image && (
              <img src={memory.image} alt={memory.title} />
            )}

            {memory.video && (
              <video src={memory.video} controls />
            )}

            <div className="card-content">
              <span>{memory.date || 'sem data'}</span>
              <h3>{memory.title}</h3>
              <p>{memory.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}