import { Training } from '../../types/Training';

interface TrainingAdminListProps {
  trainings: Training[];
  onEdit: (training: Training) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const TrainingAdminList: React.FC<TrainingAdminListProps> = ({
  trainings,
  onEdit,
  onDelete,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Loading trainings...</p>
      </div>
    );
  }

  if (trainings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No training materials found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Training
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Read Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Media
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trainings.map((training) => (
              <tr key={training.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {training.imageUrl && (
                      <div className="flex-shrink-0 h-12 w-12 mr-3">
                        <img
                          className="h-12 w-12 rounded object-cover"
                          src={training.imageUrl.startsWith('http') 
                            ? training.imageUrl 
                            : `http://localhost:5000${training.imageUrl}`}
                          alt={training.title}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {training.title}
                      </div>
                      {training.summary && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {training.summary.substring(0, 60)}
                          {training.summary.length > 60 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {training.subjectCategoryName || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {training.readTimeMinutes ? `${training.readTimeMinutes} min` : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {training.orderIndex}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    {training.imageUrl && (
                      <span className="text-green-600" title="Has image">
                        <i className="fa-solid fa-image"></i>
                      </span>
                    )}
                    {training.videoUrl && (
                      <span className="text-red-600" title="Has video">
                        <i className="fa-solid fa-video"></i>
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(training)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    title="Edit"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${training.title}"?`)) {
                        onDelete(training.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
