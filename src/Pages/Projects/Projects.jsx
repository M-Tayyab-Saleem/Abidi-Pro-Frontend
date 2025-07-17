import { useState, useEffect } from 'react';
import ProjectsTable from '../../Components/ProjectsTable';
import NewProjectDrawer from '../../Components/NewProjectDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, updateProject, deleteProject } from '../../Store/projectSlice';
import { toast } from 'react-toastify';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async (projectData) => {
    try {
      await dispatch(createProject(projectData)).unwrap();
      toast.success('Project created successfully');
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    }
  };

  const handleUpdateProject = async (id, updates) => {
    try {
      await dispatch(updateProject({ id, updates })).unwrap();
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  return (
    <div className='px-4 py-2'>
      <div className='p-8 rounded-xl bg-primary'>
        <div className='bg-white px-8 py-4 font-semibold rounded-lg'>Projects</div>
        <div className='my-6'>
          <ProjectsTable 
            projects={projects} 
            loading={loading}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
            openModal={() => setShowModal(true)}
          />
        </div>
        <NewProjectDrawer 
          isOpen={showModal} 
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateProject}
        />
      </div>    
    </div>
  );
};

export default Projects;