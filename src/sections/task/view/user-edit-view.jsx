import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetTask } from 'src/api/task';
import CleaningTaskEditForm from '../cleaning-task-new-edit-form';

// Transformation function to match CleaningTaskEditForm PropTypes
const transformTaskForEdit = (task) => ({
  id: task?._id || '',
  room: task?.roomId?.roomNumber?.toString() || task?.roomId?.toString() || 'Unknown',
  category: task?.roomId?.roomType?.title || task?.roomId?.roomType || 'Unknown', // Handle roomType as ID or object
  description: task?.status?.description || '',
  dueDate: task?.dueDate || '',
  assignedTo: task?.housekeeperId?._id || task?.housekeeperId?.toString() || '', // Use _id for housekeeper
  priority: task?.priority
    ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    : 'Medium',
  status: task?.status?.statusType || 'dirty',
  maintenanceAndDamages: task?.status?.maintenanceAndDamages || [],
  roomId: task?.roomId?._id || task?.roomId?.toString() || 'Unknown', // Handle roomId as object or string
  detailedIssues: task?.status?.detailedIssues || [],
});

export default function TaskEditView({ id }) {
  const settings = useSettingsContext();
  const { state } = useLocation();
  const { task: rawTask } = state || {};
  const { task: fetchedTask, taskLoading, taskError } = useGetTask(id);

  console.log('FETCHED_TASK', fetchedTask);
  console.log('RAW_TASK', rawTask);

  // Refactor nested ternary into if statements
  let task = null;
  if (rawTask) {
    task = transformTaskForEdit(rawTask);
  } else if (fetchedTask) {
    task = transformTaskForEdit(fetchedTask);
  }

  console.log('TASK_EDIT_VIEW_TASK', task);

  if (taskLoading) return <Container>Loading...</Container>;
  if (taskError || !task) {
    return <Container>Error loading task: {taskError?.message || 'Task not found'}</Container>;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Task Update"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Task List', href: paths.dashboard.task.root },
          { name: 'Task Update' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CleaningTaskEditForm task={task} />
    </Container>
  );
}

TaskEditView.propTypes = {
  id: PropTypes.string.isRequired,
};
