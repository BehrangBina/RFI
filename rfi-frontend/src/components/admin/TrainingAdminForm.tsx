import { useState, useEffect } from 'react';
import { Training, SubjectCategory } from '../../types/Training';

interface TrainingFormData {
  title: string;
  content: string;
  summary: string;
  videoUrl: string;
  imageUrl: string;
  readTimeMinutes: number;
  orderIndex: number;
  subjectCategoryId: number;
}

interface TrainingAdminFormProps {
  onSubmit: (formData: TrainingFormData) => Promise<void>;
  onCancel: () => void;
  editingTraining?: Training | null;
  categories: SubjectCategory[];
}

export const TrainingAdminForm: React.FC<TrainingAdminFormProps> = ({
  onSubmit,
  onCancel,
  editingTraining,
  categories,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TrainingFormData>({
    title: '',
    content: '',
    summary: '',
    videoUrl: '',
    imageUrl: '',
    readTimeMinutes: 5,
    orderIndex: 1,
    subjectCategoryId: categories[0]?.id || 0,
  });

  useEffect(() => {
    if (editingTraining) {
      setFormData({
        title: editingTraining.title,
        content: editingTraining.content || '',
        summary: editingTraining.summary || '',
        videoUrl: editingTraining.videoUrl || '',
        imageUrl: editingTraining.imageUrl || '',
        readTimeMinutes: editingTraining.readTimeMinutes || 5,
        orderIndex: editingTraining.orderIndex || 1,
        subjectCategoryId: editingTraining.subjectCategoryId || categories[0]?.id || 0,
      });
    }
  }, [editingTraining, categories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'readTimeMinutes' || name === 'orderIndex' || name === 'subjectCategoryId'
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.subjectCategoryId) {
      alert('Title, Content, and Category are required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      if (!editingTraining) {
        setFormData({
          title: '',
          content: '',
          summary: '',
          videoUrl: '',
          imageUrl: '',
          readTimeMinutes: 5,
          orderIndex: 1,
          subjectCategoryId: categories[0]?.id || 0,
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
        {editingTraining ? 'Edit' : 'Add'} Training Material
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
              placeholder="e.g., What is a Constitutional Monarchy?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="subjectCategoryId"
              value={formData.subjectCategoryId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Read Time (minutes)
            </label>
            <input
              type="number"
              name="readTimeMinutes"
              value={formData.readTimeMinutes}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Index
            </label>
            <input
              type="number"
              name="orderIndex"
              value={formData.orderIndex}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Display order within category</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of the training material..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg or /images/training/..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (YouTube Embed)
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://www.youtube.com/embed/..."
            />
            <p className="text-xs text-gray-500 mt-1">Use YouTube embed URL format</p>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content (HTML) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Enter HTML content here... Use tags like <h2>, <p>, <ul>, <li>, <table>, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            HTML formatting supported. Use semantic tags for proper structure.
          </p>
        </div>

        {/* Content Preview */}
        {formData.content && (
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Content Preview:</h3>
            <div 
              className="prose max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingTraining ? 'Update' : 'Create'} Training
          </button>
          {editingTraining && (
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
