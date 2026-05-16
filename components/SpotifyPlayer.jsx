export default function SpotifyPlayer() {
  return (
    <section className="spotify-section">
      <h2>Nossa música 🎵</h2>

      <div className="spotify-box">
        <iframe
          src="https://open.spotify.com/embed/track/6P7Uodyh8g40Nyc3no6R8E?utm_source=generator"
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  )
}