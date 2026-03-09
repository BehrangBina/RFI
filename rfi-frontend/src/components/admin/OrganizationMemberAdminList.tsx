import { OrganizationMember } from '../../types/OrganizationMember';

interface OrganizationMemberAdminListProps {
  members: OrganizationMember[];
  onEdit: (member: OrganizationMember) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const OrganizationMemberAdminList: React.FC<OrganizationMemberAdminListProps> = ({
  members,
  onEdit,
  onDelete,
  loading,
}) => {
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

  const allMembers = flattenMembers(members);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Loading members...</p>
      </div>
    );
  }

  if (allMembers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No organization members found</p>
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
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {member.imageUrl ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={member.imageUrl}
                          alt={member.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.name}
                      </div>
                      {member.bio && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {member.bio.substring(0, 50)}
                          {member.bio.length > 50 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.position}</div>
                  {!member.parentId && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Leadership
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {member.email && (
                      <div className="flex items-center gap-1">
                        <i className="fa-solid fa-envelope text-gray-400"></i>
                        <a
                          href={`mailto:${member.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-1">
                        <i className="fa-solid fa-phone text-gray-400"></i>
                        <a
                          href={`tel:${member.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(member)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <i className="fa-solid fa-edit"></i> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${member.name}?`
                        )
                      ) {
                        onDelete(member.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fa-solid fa-trash"></i> Delete
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
