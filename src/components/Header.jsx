import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="App-header">
      <h1>Hệ thống phát hiện và cảnh báo vi phạm an toàn lao động</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/alerts">Alerts</Link></li>
          <li><Link to="/violation-details">Violation Details</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;