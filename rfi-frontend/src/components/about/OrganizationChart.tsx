import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OrganizationMember } from '../../types/OrganizationMember';
import { organizationService } from '../../services/organizationService';

interface MemberCardProps {
  member: OrganizationMember;
  isLeader?: boolean;
  delay?: number;
}

const MemberCard = ({ member, isLeader = false, delay = 0 }: MemberCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative group ${isLeader ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}`}
    >
      <motion.div
        className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-700 ${
          isLeader ? 'border-[#46A2B9] border-2' : 'hover:border-[#46A2B9]'
        }`}
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className={`flex ${isLeader ? 'flex-col md:flex-row items-center' : 'flex-col'} gap-4`}>
          {/* Profile Image */}
          <div className={`${isLeader ? 'w-24 h-24 md:w-32 md:h-32' : 'w-20 h-20 mx-auto'} flex-shrink-0`}>
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full rounded-full object-cover border-4 border-[#46A2B9] shadow-lg"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#46A2B9] to-[#5bc0de] flex items-center justify-center shadow-lg">
                <span className={`text-white font-bold ${isLeader ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>
                  {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Member Info */}
          <div className={`flex-1 ${isLeader ? 'text-center md:text-left' : 'text-center'}`}>
            <h3 className={`font-bold text-white mb-2 ${isLeader ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
              {member.name}
            </h3>
            <p className={`text-[#5bc0de] font-semibold mb-2 ${isLeader ? 'text-lg md:text-xl' : 'text-base'}`}>
              {member.position}
            </p>

            {/* Contact Info */}
            {(member.email || member.phone) && (
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-3">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-400 hover:text-[#46A2B9] transition-colors text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fa-solid fa-envelope mr-1"></i>
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="text-gray-400 hover:text-[#46A2B9] transition-colors text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fa-solid fa-phone mr-1"></i>
                    {member.phone}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Expand Icon */}
          {member.bio && (
            <div className="absolute top-4 right-4">
              <i className={`fa-solid fa-chevron-${showDetails ? 'up' : 'down'} text-gray-400 group-hover:text-[#46A2B9] transition-colors`}></i>
            </div>
          )}
        </div>

        {/* Bio - Expandable */}
        {member.bio && showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <p className="text-gray-300 leading-relaxed text-sm">{member.bio}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const OrganizationChart = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await organizationService.getAllMembers();
      setMembers(data);
    } catch (err) {
      setError('Failed to load organization members');
      console.error(err);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46A2B9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
        <i className="fa-solid fa-exclamation-triangle text-red-500 text-3xl mb-3"></i>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <i className="fa-solid fa-users text-gray-600 text-4xl mb-3"></i>
        <p className="text-gray-400">No organization members found</p>
      </div>
    );
  }

  const allMembers = flattenMembers(members);
  const leaders = allMembers.filter(m => !m.parentId);
  const teamMembers = allMembers.filter(m => m.parentId);

  return (
    <div className="space-y-8">
      {/* Leadership Section */}
      {leaders.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((leader, index) => (
              <MemberCard key={leader.id} member={leader} isLeader delay={index * 0.1} />
            ))}
          </div>
        </div>
      )}

      {/* Team Members Section */}
      {teamMembers.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} delay={(leaders.length + index) * 0.1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
