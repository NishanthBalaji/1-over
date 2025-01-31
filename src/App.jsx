import { Routes, Route } from "react-router-dom";
import './App.css'
import HandCricket from './components/HandCricket'

import Toss from './components/Toss'

import Game from './components/Game'


function App() {


  return (

    <Routes>
      <Route path="/" element={<HandCricket />} />
      <Route path="/toss" element={<Toss />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
}

export default App
