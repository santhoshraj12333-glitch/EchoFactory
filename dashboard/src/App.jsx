import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import History from './pages/History.jsx'
import Documentation from './pages/Documentation.jsx'
import About from './pages/About.jsx'

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Page><Dashboard /></Page>} />
        <Route path="history" element={<Page><History /></Page>} />
        <Route path="documentation" element={<Page><Documentation /></Page>} />
        <Route path="about" element={<Page><About /></Page>} />
      </Route>
    </Routes>
  )
}

export default App