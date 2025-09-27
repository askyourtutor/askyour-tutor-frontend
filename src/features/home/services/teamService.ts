import { 
  mockTeamMembers, 
  getTeamMemberById, 
  getTeamMembersByPosition, 
  getFeaturedTeamMembers, 
  getInstructors,
  type TeamMember 
} from '../../../data/team';

export type { TeamMember };

export class TeamService {

  // Get all team members
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      // In production: const response = await fetch(this.baseUrl);
      // return await response.json();
      
      return mockTeamMembers;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw new Error('Failed to fetch team members');
    }
  }

  // Get team member by ID
  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    try {
      // In production: const response = await fetch(`/api/team/${id}`);
      // return await response.json();
      
      return getTeamMemberById(id) || null;
    } catch (error) {
      console.error('Error fetching team member:', error);
      throw new Error('Failed to fetch team member');
    }
  }

  // Get team members by position/role
  async getTeamMembersByPosition(position: string): Promise<TeamMember[]> {
    try {
      // In production: const response = await fetch(`/api/team/position/${position}`);
      // return await response.json();
      
      return getTeamMembersByPosition(position);
    } catch (error) {
      console.error('Error fetching team members by position:', error);
      throw new Error('Failed to fetch team members by position');
    }
  }

  // Get featured team members (for homepage)
  async getFeaturedTeamMembers(limit: number = 4): Promise<TeamMember[]> {
    try {
      // In production: const response = await fetch(`/api/team/featured?limit=${limit}`);
      // return await response.json();
      
      return getFeaturedTeamMembers(limit);
    } catch (error) {
      console.error('Error fetching featured team members:', error);
      throw new Error('Failed to fetch featured team members');
    }
  }

  // Get instructors only
  async getInstructors(): Promise<TeamMember[]> {
    try {
      // In production: const response = await fetch(`/api/team/instructors`);
      // return await response.json();
      
      return getInstructors();
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw new Error('Failed to fetch instructors');
    }
  }
}

export const teamService = new TeamService();
