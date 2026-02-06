'use client';

import { useState, useEffect } from 'react';

interface CarouselPhoto {
  id: number;
  title: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [photos, setPhotos] = useState<CarouselPhoto[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/carousel');
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('title', title);
    formData.append('order', order.toString());

    try {
      const response = await fetch('http://localhost:5000/api/admin/carousel', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setFile(null);
        setTitle('');
        setOrder(0);
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      await fetch(`http://localhost:5000/api/admin/carousel/${id}`, {
        method: 'DELETE',
      });
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const toggleActive = async (photo: CarouselPhoto) => {
    try {
      await fetch(`http://localhost:5000/api/admin/carousel/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: photo.title,
          order: photo.order,
          isActive: !photo.isActive,
        }),
      });
      fetchPhotos();
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin - Carousel Management</h1>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Carousel Photo</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Optional title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !file}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>

      {/* Photo List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Current Carousel Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="border rounded-lg p-4">
              <img
                src={`http://localhost:5000${photo.imageUrl}`}
                alt={photo.title || 'Carousel photo'}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <p className="font-medium">{photo.title || 'No title'}</p>
              <p className="text-sm text-gray-600">Order: {photo.order}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => toggleActive(photo)}
                  className={`flex-1 px-3 py-1 rounded text-sm ${
                    photo.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {photo.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}