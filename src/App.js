import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import Home from './components/Home/Home';
import Play from './components/Play/Play';

function App() {
  return (
    <div id='app'>
      <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/play' element={<Play />}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
