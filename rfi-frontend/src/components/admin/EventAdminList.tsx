import { Event } from '../../services/eventService';

interface EventAdminListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const EventAdminList: React.FC<EventAdminListProps> = ({
  events,
  onEdit,
  onDelete,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No events found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {event.images && event.images.length > 0 && (
                      <div className="flex-shrink-0 h-12 w-12 mr-3">
                        <img
                          className="h-12 w-12 rounded object-cover"
                          src={`http://localhost:5000${event.images[0].imageUrl}`}
                          alt={event.title}
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {event.summary.substring(0, 60)}
                        {event.summary.length > 60 ? '...' : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {event.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.images?.length || 0} image(s)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(event)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    title="Edit"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
                        onDelete(event.id);
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
