import { useState, useEffect } from 'react';
import { OrganizationMember } from '../../types/OrganizationMember';

interface OrganizationMemberFormData {
  name: string;
  position: string;
  email: string;
  phone: string;
  imageUrl: string;
  bio: string;
  parentId: number | null;
}

interface OrganizationMemberAdminFormProps {
  onSubmit: (formData: OrganizationMemberFormData) => Promise<void>;
  onCancel: () => void;
  editingMember?: OrganizationMember | null;
  allMembers?: OrganizationMember[];
}

export const OrganizationMemberAdminForm: React.FC<OrganizationMemberAdminFormProps> = ({
  onSubmit,
  onCancel,
  editingMember,
  allMembers = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrganizationMemberFormData>({
    name: '',
    position: '',
    email: '',
    phone: '',
    imageUrl: '',
    bio: '',
    parentId: null,
  });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        position: editingMember.position,
        email: editingMember.email || '',
        phone: editingMember.phone || '',
        imageUrl: editingMember.imageUrl || '',
        bio: editingMember.bio || '',
        parentId: editingMember.parentId || null,
      });
    }
  }, [editingMember]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'parentId' ? (value === '' ? null : parseInt(value)) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.position.trim()) {
      alert('Name and Position are required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      if (!editingMember) {
        setFormData({
          name: '',
          position: '',
          email: '',
          phone: '',
          imageUrl: '',
          bio: '',
          parentId: null,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const flattenMembers = (memberList: OrganizationMember[]): OrganizationMember[] => {
    const result: OrganizationMember[] = [];
    const flatten = (member: OrganizationMember) => {
      result.push(member);
      if (member.directReports && member.directReports.length > 0) {
        member.directReports.forEach(flatten);
      }
    };
    memberList.forEach(flatten);
    return result;
  };

  const allMembersList = flattenMembers(allMembers);
  const potentialParents = allMembersList.filter(m => m.id !== editingMember?.id);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingMember ? 'Edit' : 'Add'} Organization Member
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., President, Vice President"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+61 400 000 000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reports To</label>
            <select
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None (Leadership)</option>
              {potentialParents.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.position}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Leave as "None" for leadership positions</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to use auto-generated initials</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief biography or description..."
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingMember ? 'Update' : 'Add'} Member
          </button>
          {editingMember && (
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
