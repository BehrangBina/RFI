'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { NewsArticle } from '../types/News';
import { newsService } from '../services/newsService';
import { NewsAdminForm } from '../components/admin/NewsAdminForm';
import { NewsAdminList } from '../components/admin/NewsAdminList';
import { Poster } from '../types/Poster';
import { posterService } from '../services/posterService';
import { PosterAdminForm } from '../components/admin/PosterAdminForm';
import { PosterAdminList } from '../components/admin/PosterAdminList';
import { OrganizationMember } from '../types/OrganizationMember';
import { organizationService } from '../services/organizationService';
import { OrganizationMemberAdminForm } from '../components/admin/OrganizationMemberAdminForm';
import { OrganizationMemberAdminList } from '../components/admin/OrganizationMemberAdminList';

type AdminSection = 'carousel' | 'event' | 'news' | 'poster' | 'organization' | 'training';

interface CarouselPhoto {
  id: number;
  title: string;
  imageUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
}

interface KeyPointForm {
  title: string;
  description: string;
  orderIndex: number;
}

interface SectionForm {
  sectionType: string;
  title: string;
  orderIndex: number;
  keyPoints: KeyPointForm[];
}

interface NewsFormData {
  title: string;
  summary: string;
  category: string;
  date: string;
  readTimeMinutes: number;
  videoUrl: string;
  imageUrl: string;
  sections: SectionForm[];
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('carousel');
  const [photos, setPhotos] = useState<CarouselPhoto[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // News Management State
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

  // Poster Management State
  const [posterList, setPosterList] = useState<Poster[]>([]);
  const [posterLoading, setPosterLoading] = useState(false);
  const [showPosterForm, setShowPosterForm] = useState(false);

  // Organization Member Management State
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [editingOrgMember, setEditingOrgMember] = useState<OrganizationMember | null>(null);

  useEffect(() => {
    if (activeSection === 'carousel') {
      fetchPhotos();
    } else if (activeSection === 'news') {
      fetchNews();
    } else if (activeSection === 'poster') {
      fetchPosters();
    } else if (activeSection === 'organization') {
      fetchOrganizationMembers();
    }
  }, [activeSection]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/carousel');
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
      const response = await fetch('http://localhost:5000/api/carousel', {
        method: 'POST',
        headers: authService.getAuthHeader(),
        body: formData,
      });
      
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }
      
      if (response.ok) {
        setFile(null);
        setTitle('');
        setOrder(0);
        fetchPhotos();
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/carousel/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader(),
      });
      
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }
      
      if (response.ok) {
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const toggleActive = async (photo: CarouselPhoto) => {
    try {
      const response = await fetch(`http://localhost:5000/api/carousel/${photo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify({
          title: photo.title,
          order: photo.orderIndex,
          isActive: !photo.isActive,
        }),
      });
      
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }
      
      if (response.ok) {
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };

  // ==================== NEWS MANAGEMENT FUNCTIONS ====================

  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      const data = await newsService.getAllNews();
      setNewsList(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to load news articles');
    } finally {
      setNewsLoading(false);
    }
  };

  const handleCreateNews = () => {
    setEditingNews(null);
    setShowNewsForm(true);
  };

  const handleEditNews = (news: NewsArticle) => {
    setEditingNews(news);
    setShowNewsForm(true);
  };

  const handleCancelNewsForm = () => {
    setShowNewsForm(false);
    setEditingNews(null);
  };

  const handleSubmitNews = async (formData: NewsFormData) => {
    try {
      const payload = {
        title: formData.title,
        summary: formData.summary,
        category: formData.category || null,
        date: new Date(formData.date).toISOString(),
        readTimeMinutes: formData.readTimeMinutes,
        videoUrl: formData.videoUrl || null,
        imageUrl: formData.imageUrl || null,
        sections: formData.sections.map((section) => ({
          sectionType: section.sectionType,
          title: section.title || null,
          orderIndex: section.orderIndex,
          keyPoints: section.keyPoints.map((kp) => ({
            title: kp.title || null,
            description: kp.description,
            orderIndex: kp.orderIndex,
          })),
        })),
      };

      const response = await fetch(
        editingNews
          ? `http://localhost:5000/api/news/${editingNews.id}`
          : 'http://localhost:5000/api/news',
        {
          method: editingNews ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authService.getAuthHeader(),
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        alert(
          editingNews ? 'News article updated successfully!' : 'News article created successfully!'
        );
        setShowNewsForm(false);
        setEditingNews(null);
        fetchNews();
      } else {
        const errorData = await response.json();
        alert(`Failed to ${editingNews ? 'update' : 'create'} news article: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting news:', error);
      alert(`Failed to ${editingNews ? 'update' : 'create'} news article`);
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader(),
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        alert('News article deleted successfully!');
        fetchNews();
      } else {
        alert('Failed to delete news article');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news article');
    }
  };

  // ==================== ORGANIZATION MEMBER MANAGEMENT FUNCTIONS ====================

  const fetchOrganizationMembers = async () => {
    try {
      setOrgLoading(true);
      const data = await organizationService.getAllMembers();
      setOrganizationMembers(data);
    } catch (error) {
      console.error('Error fetching organization members:', error);
      alert('Failed to load organization members');
    } finally {
      setOrgLoading(false);
    }
  };

  const handleCreateOrgMember = () => {
    setEditingOrgMember(null);
    setShowOrgForm(true);
  };

  const handleEditOrgMember = (member: OrganizationMember) => {
    setEditingOrgMember(member);
    setShowOrgForm(true);
  };

  const handleCancelOrgForm = () => {
    setShowOrgForm(false);
    setEditingOrgMember(null);
  };

  const handleSubmitOrgMember = async (formData: any) => {
    try {
      const response = await fetch(
        editingOrgMember
          ? `http://localhost:5000/api/organizationmembers/${editingOrgMember.id}`
          : 'http://localhost:5000/api/organizationmembers',
        {
          method: editingOrgMember ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authService.getAuthHeader(),
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        alert(
          editingOrgMember
            ? 'Organization member updated successfully!'
            : 'Organization member created successfully!'
        );
        setShowOrgForm(false);
        setEditingOrgMember(null);
        fetchOrganizationMembers();
      } else {
        const errorData = await response.json();
        alert(
          `Failed to ${
            editingOrgMember ? 'update' : 'create'
          } organization member: ${errorData.message || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error('Error submitting organization member:', error);
      alert(`Failed to ${editingOrgMember ? 'update' : 'create'} organization member`);
    }
  };

  const handleDeleteOrgMember = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/organizationmembers/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader(),
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        alert('Organization member deleted successfully!');
        fetchOrganizationMembers();
      } else {
        alert('Failed to delete organization member');
      }
    } catch (error) {
      console.error('Error deleting organization member:', error);
      alert('Failed to delete organization member');
    }
  };

  // ==================== POSTER MANAGEMENT FUNCTIONS ====================

  const fetchPosters = async () => {
    try {
      setPosterLoading(true);
      const data = await posterService.getAllPosters();
      setPosterList(data);
    } catch (error) {
      console.error('Error fetching posters:', error);
      alert('Failed to load posters');
    } finally {
      setPosterLoading(false);
    }
  };

  const handleCreatePoster = () => {
    setShowPosterForm(true);
  };

  const handleCancelPosterForm = () => {
    setShowPosterForm(false);
  };

  const handleSubmitPoster = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:5000/api/posters/upload', {
        method: 'POST',
        headers: authService.getAuthHeader(),
        body: formData,
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        alert('Poster uploaded successfully!');
        setShowPosterForm(false);
        fetchPosters();
      } else {
        const errorData = await response.json();
        alert(`Failed to upload poster: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading poster:', error);
      alert('Failed to upload poster');
    }
  };

  const handleDeletePoster = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posters/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader(),
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        alert('Poster deleted successfully!');
        fetchPosters();
      } else {
        alert('Failed to delete poster');
      }
    } catch (error) {
      console.error('Error deleting poster:', error);
      alert('Failed to delete poster');
    }
  };

  const handleDownloadPoster = async (poster: Poster) => {
    try {
      // Increment download count
      await fetch(`http://localhost:5000/api/posters/${poster.id}/download`, {
        method: 'POST',
        headers: authService.getAuthHeader(),
      });

      // Download the file
      window.open(`http://localhost:5000${poster.fileUrl}`, '_blank');
      
      // Refresh the list to update download count
      fetchPosters();
    } catch (error) {
      console.error('Error downloading poster:', error);
    }
  };

  const handleUpdatePoster = async (id: number, title: string, description: string) => {
    try {
      const poster = posterList.find(p => p.id === id);
      if (!poster) {
        alert('Poster not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/posters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify({
          ...poster,
          title,
          description: description || null,
        }),
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
        return;
      }

      if (response.ok) {
        alert('Poster updated successfully!');
        fetchPosters();
      } else {
        alert('Failed to update poster');
      }
    } catch (error) {
      console.error('Error updating poster:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Logged in as: <strong>{user?.username}</strong></span>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-lg shadow mb-6">
        <nav className="flex border-b">
          <button
            onClick={() => setActiveSection('carousel')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeSection === 'carousel'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Carousel
          </button>
          <button
            onClick={() => setActiveSection('event')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeSection === 'event'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Event
          </button>
          <button
            onClick={() => setActiveSection('news')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeSection === 'news'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveSection('poster')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeSection === 'poster'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Poster
          </button>
          <button
            onClick={() => setActiveSection('organization')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeSection === 'organization'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Organization
          </button>
          <button
            onClick={() => setActiveSection('training')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeSection === 'training'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Training
          </button>
        </nav>
      </div>

      {/* Carousel Section */}
      {activeSection === 'carousel' && (
        <>
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
                  <p className="text-sm text-gray-600">Order: {photo.orderIndex}</p>
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
        </>
      )}

      {/* Event Section */}
      {activeSection === 'event' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Event Management</h2>
          <p className="text-gray-600">Event management functionality coming soon...</p>
        </div>
      )}

      {/* News Section */}
      {activeSection === 'news' && (
        <div className="space-y-6">
          {/* Header */}
          {!showNewsForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">News Management</h2>
                  <p className="text-gray-600">Create and manage news articles</p>
                </div>
                <button
                  onClick={handleCreateNews}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>Create News Article
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {showNewsForm && (
            <NewsAdminForm
              news={editingNews}
              onSubmit={handleSubmitNews}
              onCancel={handleCancelNewsForm}
            />
          )}

          {/* List */}
          {!showNewsForm && (
            <NewsAdminList
              newsList={newsList}
              onEdit={handleEditNews}
              onDelete={handleDeleteNews}
              loading={newsLoading}
            />
          )}
        </div>
      )}

      {/* Poster Section */}
      {activeSection === 'poster' && (
        <div className="space-y-6">
          {/* Header */}
          {!showPosterForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Poster Management</h2>
                  <p className="text-gray-600">Upload and manage posters and documents</p>
                </div>
                <button
                  onClick={handleCreatePoster}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>Upload Poster
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          {showPosterForm && (
            <PosterAdminForm
              onSubmit={handleSubmitPoster}
              onCancel={handleCancelPosterForm}
            />
          )}

          {/* List */}
          {!showPosterForm && (
            <>
              {posterLoading ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                  <p className="text-gray-600">Loading posters...</p>
                </div>
              ) : (
                <PosterAdminList
                  posters={posterList}
                  onDelete={handleDeletePoster}
                  onDownload={handleDownloadPoster}
                  onUpdate={handleUpdatePoster}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Organization Section */}
      {activeSection === 'organization' && (
        <div>
          <div className="mb-6">
            {!showOrgForm && (
              <button
                onClick={handleCreateOrgMember}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Add New Member
              </button>
            )}
          </div>

          {showOrgForm && (
            <OrganizationMemberAdminForm
              onSubmit={handleSubmitOrgMember}
              onCancel={handleCancelOrgForm}
              editingMember={editingOrgMember}
              allMembers={organizationMembers}
            />
          )}

          <OrganizationMemberAdminList
            members={organizationMembers}
            onEdit={handleEditOrgMember}
            onDelete={handleDeleteOrgMember}
            loading={orgLoading}
          />
        </div>
      )}

      {/* Training Section */}
      {activeSection === 'training' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Training Management</h2>
          <p className="text-gray-600">Training management functionality coming soon...</p>
        </div>
      )}
    </div>
  );
}
