export interface OrganizationMember {
  id: number;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
  parentId?: number;
  directReports?: OrganizationMember[];
}
