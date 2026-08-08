import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/documentation', label: 'Documentation' },
  { to: '/about', label: 'About' },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar links={navLinks} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}