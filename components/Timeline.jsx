export default function Timeline({ memories }) {
  return (
    <section className="timeline">
      <h2>Linha do Tempo</h2>

      <div className="cards">
        {memories.length === 0 && (
          <p className="empty-message">
            Ainda não há memórias publicadas.
          </p>
        )}

        {memories.map((memory) => (
          <div key={memory.id} className="card">
            {memory.image && <img src={memory.image} alt={memory.title} />}

            {memory.video && (
              <video src={memory.video} controls />
            )}

            <div className="card-content">
              <span>{memory.date}</span>
              <h3>{memory.title}</h3>
              <p>{memory.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}