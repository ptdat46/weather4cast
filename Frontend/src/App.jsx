import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
// import ForecastDetail from './pages/ForecastDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        {/* <Route path='/forecast' element={<ForecastDetail />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
