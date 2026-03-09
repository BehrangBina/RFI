import { useState, useEffect } from 'react';
import { SubjectCategory } from '../../types/Training';

interface SubjectCategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
  orderIndex: number;
}

interface SubjectCategoryAdminFormProps {
  onSubmit: (formData: SubjectCategoryFormData) => Promise<void>;
  onCancel: () => void;
  editingCategory?: SubjectCategory | null;
}

export const SubjectCategoryAdminForm: React.FC<SubjectCategoryAdminFormProps> = ({
  onSubmit,
  onCancel,
  editingCategory,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubjectCategoryFormData>({
    name: '',
    description: '',
    imageUrl: '',
    orderIndex: 1,
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description || '',
        imageUrl: editingCategory.imageUrl || '',
        orderIndex: editingCategory.orderIndex || 1,
      });
    }
  }, [editingCategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'orderIndex' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Name and Description are required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      if (!editingCategory) {
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          orderIndex: 1,
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
        {editingCategory ? 'Edit' : 'Add'} Subject Category
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Constitutional Monarchy"
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
            <p className="text-xs text-gray-500 mt-1">Display order (lower appears first)</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of this category..."
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
              placeholder="https://example.com/image.jpg or /images/categories/..."
            />
            <p className="text-xs text-gray-500 mt-1">Optional category thumbnail</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'} Category
          </button>
          {editingCategory && (
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
