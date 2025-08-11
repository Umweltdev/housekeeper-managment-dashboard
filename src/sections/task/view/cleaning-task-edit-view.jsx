import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Grid,
  Chip,
  Paper,
  Stack,
  Alert,
  Button,
  Divider,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

const STATUS_OPTIONS = ['dirty', 'cleaned', 'inspected'];
const STATUS_COLORS = {
  dirty: 'error',
  cleaned: 'success',
  inspected: 'info',
};
const MAINTENANCE_PRIORITIES = ['Low', 'Medium', 'High'];
const PRIORITY_COLORS = {
  Low: 'info',
  Medium: 'warning',
  High: 'error',
};

const ROOM_CATEGORIES = ['Standard', 'Deluxe', 'Suite'];
const ASSIGNEES = ['John Doe', 'Jane Smith', 'Alex Brown'];
const TASK_TYPES = ['cleaning', 'maintenance', 'inspection'];

export default function CleaningTaskEditForm({ task }) {
  const router = useNavigate();

  const [issues, setIssues] = useState(task.maintenanceAndDamages || []);
  const [status, setStatus] = useState(task.status);
  const [category, setCategory] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo);
  const [taskType, setTaskType] = useState(task.type);
  const [priority, setPriority] = useState(task.priority);
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSaveChanges = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setOpenSnackbar(true);

      setTimeout(() => {
        router('/dashboard/task');
      }, 1500);
    }, 1500);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Room Info */}
        <Grid item xs={12} sx={{ maxHeight: 1000, overflowY: 'auto' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h2">
                Room #{task.room}
              </Typography>

              <Label
                variant="soft"
                color={STATUS_COLORS[status] || 'default'}
                sx={{ textTransform: 'capitalize' }}
              >
                {status}
              </Label>

              <Label
                variant="soft"
                color={PRIORITY_COLORS[priority] || 'default'}
                sx={{ textTransform: 'capitalize' }}
              >
                {priority} Priority
              </Label>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {/* Room Category Dropdown */}
              <TextField
                select
                label="Room Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
              >
                {ROOM_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Description"
                value={task.description}
                multiline
                rows={3}
                fullWidth
              />

              {/* Due Date DateTime Picker */}
              <TextField
                label="Due Date & Time"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              {/* Assigned To Dropdown */}
              <TextField
                select
                label="Assigned To"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                fullWidth
              >
                {ASSIGNEES.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>

              {/* Priority Dropdown */}
              <TextField
                select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                fullWidth
              >
                {MAINTENANCE_PRIORITIES.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>

              {/* Cleaning Status Dropdown */}
              <TextField
                select
                label="Cleaning Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="eva:close-fill" />}
          onClick={() => router('/dashboard/task')}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          startIcon={
            isSaving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Iconify icon="eva:save-fill" />
            )
          }
          disabled={isSaving}
          sx={{ minWidth: 140 }}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Changes saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

CleaningTaskEditForm.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    assignedTo: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    maintenanceAndDamages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        description: PropTypes.string,
        priority: PropTypes.string,
        date: PropTypes.string,
      })
    ),
  }).isRequired,
};
