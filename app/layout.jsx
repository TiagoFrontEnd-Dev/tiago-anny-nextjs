import '../styles/globals.css'
import SpotifyPlayer from '../components/SpotifyPlayer'

export const metadata = {
  title: 'Tiago & Anny',
  description: 'Nossa história'
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <SpotifyPlayer />
      </body>
    </html>
  )
}