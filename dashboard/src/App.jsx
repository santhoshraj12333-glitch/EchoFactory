import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import History from './pages/History.jsx'
import Documentation from './pages/Documentation.jsx'
import About from './pages/About.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="history" element={<History />} />
        <Route path="documentation" element={<Documentation />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App