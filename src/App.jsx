import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AlertsPage from './pages/AlertsPage';
import ViolationDetailsPage from './pages/ViolationDetailsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/violation-details" element={<ViolationDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;