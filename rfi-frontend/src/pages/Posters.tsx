import { useState } from 'react';
import { PosterUpload } from '../components/PosterUpload';
import { PosterList } from '../components/PosterList';

const Posters = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Posters</h1>
      <PosterUpload onUploadSuccess={handleUploadSuccess} />
      <PosterList refresh={refreshKey} />
    </div>
  );
};

export default Posters;
