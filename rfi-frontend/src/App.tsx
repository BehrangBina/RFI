import React, { useState } from 'react';
import './App.css';
import { PosterUpload } from './components/PosterUpload';
import { PosterList } from './components/PosterList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>RFI Poster Manager</h1>
      </header>
      <main>
        <PosterUpload onUploadSuccess={handleUploadSuccess} />
        <PosterList refresh={refreshKey} />
      </main>
    </div>
  );
}

export default App;
