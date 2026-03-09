import { useState, useEffect } from 'react';
import { Event } from '../../services/eventService';
import { authService } from '../../services/authService';

interface EventImage {
  imageUrl: string;
  caption: string;
  orderIndex: number;
}

interface EventSection {
  sectionType: string;
  title: string;
  content: string;
  orderIndex: number;
}

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  summary: string;
  description: string;
  attendeeCount: number | null;
  videoUrl: string;
  images: EventImage[];
  sections: EventSection[];
}

interface EventAdminFormProps {
  onSubmit: (formData: EventFormData) => Promise<void>;
  onCancel: () => void;
  editingEvent?: Event | null;
}

export const EventAdminForm: React.FC<EventAdminFormProps> = ({
  onSubmit,
  onCancel,
  editingEvent,
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    time: '14:00',
    location: '',
    category: 'rally',
    summary: '',
    description: '',
    attendeeCount: null,
    videoUrl: '',
    images: [],
    sections: [],
  });

  useEffect(() => {
    if (editingEvent) {
      const eventDate = new Date(editingEvent.date);
      const dateStr = eventDate.toISOString().split('T')[0];
      const timeStr = eventDate.toTimeString().substring(0, 5);
      
      setFormData({
        title: editingEvent.title,
        date: dateStr,
        time: timeStr,
        location: editingEvent.location,
        category: editingEvent.category,
        summary: editingEvent.summary,
        description: editingEvent.description || '',
        attendeeCount: editingEvent.attendeeCount || null,
        videoUrl: editingEvent.videoUrl || '',
        images: editingEvent.images || [],
        sections: editingEvent.sections || [],
      });
    }
  }, [editingEvent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'attendeeCount' ? (value === '' ? null : parseInt(value)) : value 
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/events/upload-image', {
        method: 'POST',
        headers: authService.getAuthHeader(),
        body: uploadFormData,
      });

      if (response.ok) {
        const imageUrl = await response.text();
        setFormData((prev) => {
          const newImage: EventImage = {
            imageUrl: imageUrl.replace(/"/g, ''),
            caption: '',
            orderIndex: prev.images.length + 1,
          };
          return {
            ...prev,
            images: [...prev.images, newImage],
          };
        });
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageCaptionChange = (index: number, caption: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, caption } : img
      ),
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index).map((img, i) => ({
        ...img,
        orderIndex: i + 1,
      })),
    }));
  };

  const handleAddSection = () => {
    const newSection: EventSection = {
      sectionType: 'description',
      title: '',
      content: '',
      orderIndex: formData.sections.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleSectionChange = (
    index: number,
    field: keyof EventSection,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleRemoveSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index).map((section, i) => ({
        ...section,
        orderIndex: i + 1,
      })),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.date || !formData.location.trim()) {
      alert('Title, Date, and Location are required');
      return;
    }

    setLoading(true);
    try {
      const dateTimeString = `${formData.date}T${formData.time}:00`;
      const submitData = {
        ...formData,
        date: new Date(dateTimeString).toISOString(),
      };
      await onSubmit(submitData);
      if (!editingEvent) {
        setFormData({
          title: '',
          date: '',
          time: '14:00',
          location: '',
          category: 'rally',
          summary: '',
          description: '',
          attendeeCount: null,
          videoUrl: '',
          images: [],
          sections: [],
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingEvent ? 'Edit' : 'Add'} Event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rally">Rally</option>
              <option value="solidarity">Solidarity</option>
              <option value="protest">Protest</option>
              <option value="community">Community</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attendee Count
            </label>
            <input
              type="number"
              name="attendeeCount"
              value={formData.attendeeCount || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
              min="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of the event..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the event..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>

        {/* Images Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Images</h3>
            <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
          
          {formData.images.length > 0 && (
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="border border-gray-300 rounded-md p-3 flex items-start gap-3">
                  <img
                    src={`http://localhost:5000${image.imageUrl}`}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Image caption"
                      value={image.caption}
                      onChange={(e) => handleImageCaptionChange(index, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Order: {image.orderIndex}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sections */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Content Sections</h3>
            <button
              type="button"
              onClick={handleAddSection}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add Section
            </button>
          </div>

          {formData.sections.length > 0 && (
            <div className="space-y-4">
              {formData.sections.map((section, index) => (
                <div key={index} className="border border-gray-300 rounded-md p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Type
                      </label>
                      <select
                        value={section.sectionType}
                        onChange={(e) => handleSectionChange(index, 'sectionType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="description">Description</option>
                        <option value="speech">Speech</option>
                        <option value="outcomes">Outcomes</option>
                        <option value="how_to_help">How to Help</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Section title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Section content..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingEvent ? 'Update' : 'Create'} Event
          </button>
          {editingEvent && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
