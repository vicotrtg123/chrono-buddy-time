
import { authService } from './authService';
import { timeEntriesService } from './timeEntriesService';
import { editRequestsService } from './editRequestsService';
import { usersService } from './usersService';

// Re-export all services as a consolidated API object for backwards compatibility
export const api = {
  // Auth services
  login: authService.login,
  
  // Time entries services
  getTimeEntries: timeEntriesService.getTimeEntries,
  getAllTimeEntries: timeEntriesService.getAllTimeEntries,
  clockIn: timeEntriesService.clockIn,
  clockOut: timeEntriesService.clockOut,
  
  // Edit requests services
  requestEditTimeEntry: editRequestsService.requestEditTimeEntry,
  getEditRequests: editRequestsService.getEditRequests,
  approveEditRequest: editRequestsService.approveEditRequest,
  
  // User management services
  getUsers: usersService.getUsers,
  createUser: usersService.createUser,
  updateUser: usersService.updateUser,
  changePassword: usersService.changePassword,
};
