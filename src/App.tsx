import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoyaltyAdmin from './pages/LoyaltyAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoyaltyAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;