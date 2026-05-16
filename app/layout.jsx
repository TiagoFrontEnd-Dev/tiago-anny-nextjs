import '../styles/globals.css'

export const metadata = {
  title: 'Tiago & Anny',
  description: 'Nossa história'
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}