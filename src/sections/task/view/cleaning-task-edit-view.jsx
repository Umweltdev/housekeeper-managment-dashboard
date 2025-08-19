import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Alert,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Snackbar,
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

export default function CleaningTaskEditForm({ task }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    roomCategories = ['Standard', 'Deluxe', 'Suite'],
    assignees = ['John Doe', 'Jane Smith', 'Alex Brown'],
  } = state || {};

  const [status, setStatus] = useState(task.status || 'dirty');
  const [category, setCategory] = useState(task.category || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || '');
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [description, setDescription] = useState(task.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);
  const [newIssue, setNewIssue] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('Medium');
  const [issues, setIssues] = useState(task.maintenanceAndDamages || []);

  const handleAddIssue = () => {
    if (newIssue.trim()) {
      setIssues([
        ...issues,
        {
          issue: newIssue,
          issuePriority: newIssuePriority.toLowerCase(),
          reportedAt: new Date().toISOString(),
        },
      ]);
      setNewIssue('');
      setNewIssuePriority('Medium');
    }
  };

  const handleRemoveIssue = (index) => {
    setIssues(issues.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedTask = {
        status: {
          statusType: status,
          description,
          maintenanceAndDamages: issues,
          detailedIssues: task.detailedIssues || [],
        },
        roomId: task.roomId || task.room || '',
        housekeeperId: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority: priority.toLowerCase(),
        roomType: { title: category },
      };

      const response = await axios.patch(`/api/tasks/${task.id}`, updatedTask);
      if (response.data.success) {
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/dashboard/task');
        }, 1500);
      } else {
        setError(response.data.error || 'Failed to save task');
      }
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Room Info */}
        <Grid item xs={12} sx={{ maxHeight: 1000, overflowY: 'auto' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h2">
                Room #{task.room || 'Unknown'}
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
                {roomCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              {/* Description */}
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                <MenuItem value="">None</MenuItem>
                {assignees.map((name) => (
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

              {/* Maintenance and Damages */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Maintenance and Damages
              </Typography>
              <Stack spacing={1}>
                {issues.map((issue, index) => (
                  <Stack key={index} direction="row" alignItems="center" spacing={2}>
                    <TextField
                      label="Issue"
                      value={issue.issue}
                      onChange={(e) =>
                        setIssues(
                          issues.map((item, i) =>
                            i === index ? { ...item, issue: e.target.value } : item
                          )
                        )
                      }
                      fullWidth
                    />
                    <TextField
                      select
                      label="Priority"
                      value={
                        issue.issuePriority.charAt(0).toUpperCase() + issue.issuePriority.slice(1)
                      }
                      onChange={(e) =>
                        setIssues(
                          issues.map((item, i) =>
                            i === index
                              ? { ...item, issuePriority: e.target.value.toLowerCase() }
                              : item
                          )
                        )
                      }
                      sx={{ minWidth: 120 }}
                    >
                      {MAINTENANCE_PRIORITIES.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton color="error" onClick={() => handleRemoveIssue(index)}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Stack>
                ))}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TextField
                    label="New Issue"
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Priority"
                    value={newIssuePriority}
                    onChange={(e) => setNewIssuePriority(e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    {MAINTENANCE_PRIORITIES.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddIssue}
                    disabled={!newIssue.trim()}
                  >
                    Add
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Footer */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="eva:close-fill" />}
          onClick={() => navigate('/dashboard/task')}
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
    assignedTo: PropTypes.string,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    maintenanceAndDamages: PropTypes.arrayOf(
      PropTypes.shape({
        issue: PropTypes.string.isRequired,
        issuePriority: PropTypes.string.isRequired,
        reportedAt: PropTypes.string,
      })
    ),
    roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    detailedIssues: PropTypes.array,
  }).isRequired,
};
