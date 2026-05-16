'use client'

export default function SpotifyPlayer() {
  return (
    <div className="spotify-floating">
      <iframe
        src="https://open.spotify.com/embed/track/6P7Uodyh8g40Nyc3no6R8E?utm_source=generator"
        width="100%"
        height="80"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  )
}