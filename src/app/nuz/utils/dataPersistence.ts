import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { Team } from '../types';

const GUEST_TEAMS_KEY = 'nuzlocke_guest_teams';
const USER_TEAMS_KEY = 'nuzlocke_user_teams';

export const saveTeams = (teams: Team[], isAuthenticated: boolean, userId?: string) => {
  try {
    const key = isAuthenticated ? `${USER_TEAMS_KEY}_${userId}` : GUEST_TEAMS_KEY;
    setCookie(key, JSON.stringify(teams), { 
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/nuz'
    });
    return true;
  } catch (error) {
    console.error('Error saving teams:', error);
    return false;
  }
};

export const loadTeams = (isAuthenticated: boolean, userId?: string): Team[] | null => {
  try {
    const key = isAuthenticated ? `${USER_TEAMS_KEY}_${userId}` : GUEST_TEAMS_KEY;
    const savedTeams = getCookie(key);
    
    if (savedTeams) {
      return JSON.parse(savedTeams as string);
    }
    return null;
  } catch (error) {
    console.error('Error loading teams:', error);
    return null;
  }
};

export const clearGuestTeams = () => {
  try {
    deleteCookie(GUEST_TEAMS_KEY, { path: '/nuz' });
    return true;
  } catch (error) {
    console.error('Error clearing guest teams:', error);
    return false;
  }
};

export const clearUserTeams = (userId: string) => {
  try {
    deleteCookie(`${USER_TEAMS_KEY}_${userId}`, { path: '/nuz' });
    return true;
  } catch (error) {
    console.error('Error clearing user teams:', error);
    return false;
  }
};

export const migrateGuestToUser = (userId: string): Team[] | null => {
  try {
    const guestTeams = getCookie(GUEST_TEAMS_KEY);
    if (guestTeams) {
      const teams = JSON.parse(guestTeams as string);
      // Save to user storage
      saveTeams(teams, true, userId);
      // Clear guest storage
      clearGuestTeams();
      return teams;
    }
    return null;
  } catch (error) {
    console.error('Error migrating guest teams:', error);
    return null;
  }
};
