// src/App.js
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ marginLeft: '250px', padding: '20px', flex: 1 }}>
          {/* Main content goes here */}
        </div>
      </div>
    </div>
  );
}

export default App;
