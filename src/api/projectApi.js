import api from '../axios';

const API_URL = '/projects';

const getProjects = async () => {
  const response = await api.get(API_URL);
  return response;
};

const getProjectById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response;
};

const getProjectTasks = async (projectId) => {
  const response = await api.get(`${API_URL}/${projectId}/tasks`);
  return response;
};

const createProject = async (projectData) => {
  const response = await api.post(API_URL, projectData);
  return response;
};

const updateProject = async (id, updates) => {
  const response = await api.patch(`${API_URL}/${id}`, updates);
  return response;
};

const deleteProject = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response;
};

const getProjectDashboard = async () => {
  const response = await api.get(`${API_URL}/dashboard`);
  return response;
};

export default {
  getProjects,
  getProjectById,
  getProjectTasks,
  createProject,
  updateProject,
  deleteProject,
  getProjectDashboard,
};