import React from 'react';
import BarraSuperior from './components/BarraSuperior.jsx';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Live from './screens/Live.jsx';
import History from './screens/History.jsx';

function App () {
  return (
    <div className="App">
      <Router>
        <BarraSuperior />        
        <Routes>
          <Route path = "/history" element = {<History />} />
          <Route path = "/" element = {<Live />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
