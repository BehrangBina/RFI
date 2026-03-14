import { PosterList } from '../components/PosterList';

const Posters = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Posters</h1>
      {/* <PosterUpload onUploadSuccess={handleUploadSuccess} /> */}
      <PosterList />
    </div>
  );
};

export default Posters;
