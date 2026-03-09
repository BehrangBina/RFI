import { OrganizationMember } from '../types/OrganizationMember';

const API_BASE_URL = 'http://localhost:5000/api';

export const organizationService = {
  async getAllMembers(): Promise<OrganizationMember[]> {
    const response = await fetch(`${API_BASE_URL}/organizationmembers`);
    if (!response.ok) {
      throw new Error('Failed to fetch organization members');
    }
    return response.json();
  },

  async getMemberById(id: number): Promise<OrganizationMember> {
    const response = await fetch(`${API_BASE_URL}/organizationmembers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch organization member');
    }
    return response.json();
  }
};
