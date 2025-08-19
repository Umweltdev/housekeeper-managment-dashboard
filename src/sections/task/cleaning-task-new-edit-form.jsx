import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
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
import { useGetRooms } from 'src/api/room';
import { useGetRoomTypes } from 'src/api/roomType';
import { useGetUsers } from 'src/api/user';
import axiosInstance from 'src/utils/axios';

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
  const { rooms, roomsLoading } = useGetRooms();
  const { roomTypes, roomTypesLoading } = useGetRoomTypes();
  const { users, usersLoading } = useGetUsers();

  // Declare all hooks at the top level
  const [status, setStatus] = useState(task?.status || 'dirty');
  const [roomId, setRoomId] = useState(task?.roomId || task?.room || '');
  const [roomType, setRoomType] = useState(task?.category || 'Unknown');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || '');
  const [priority, setPriority] = useState(task?.priority || 'Medium');
  const [description, setDescription] = useState(task?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);
  const [newIssue, setNewIssue] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('Medium');
  const [issues, setIssues] = useState(task?.maintenanceAndDamages || []);

  // Auto-fill roomType and roomTypeId when roomId changes
  useEffect(() => {
    if (rooms && roomTypes && roomId) {
      const selectedRoom = rooms.find((room) => room._id === roomId);
      if (selectedRoom?.roomType) {
        const roomTypeData = roomTypes.find((type) => type._id === selectedRoom.roomType);
        setRoomType(roomTypeData?.title || 'Unknown');
        setRoomTypeId(roomTypeData?._id || '');
      } else {
        setRoomType('Unknown');
        setRoomTypeId('');
      }
    }
  }, [roomId, rooms, roomTypes]);

  // Early return for task not found
  if (!task) {
    return (
      <Box>
        <Typography color="error">Task not found</Typography>
      </Box>
    );
  }

  // Filter housekeepers
  const housekeepers = users ? users.filter((user) => user.role === 'housekeeper') : [];

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

  const handleRemoveIssue = (index) => setIssues(issues.filter((_, i) => i !== index));

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
        roomId: roomId || '',
        housekeeperId: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority: priority.toLowerCase(),
        roomType: roomTypeId ? { _id: roomTypeId, title: roomType } : null,
      };

      const response = await axiosInstance.put(`/api/task/${task.id}`, updatedTask);
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

  if (roomsLoading || roomTypesLoading || usersLoading) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ maxHeight: 1000, overflowY: 'auto' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h2">
                Room #{rooms?.find((r) => r._id === roomId)?.roomNumber || task.room || 'Unknown'}
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
              <TextField
                select
                label="Room Number"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                fullWidth
              >
                {rooms?.length ? (
                  rooms.map((room) => (
                    <MenuItem key={room._id} value={room._id}>
                      {room.roomNumber}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No rooms available</MenuItem>
                )}
              </TextField>
              <TextField
                label="Room Type"
                value={roomType}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="Due Date & Time"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Assigned To"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                {housekeepers.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </TextField>
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
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
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
  }),
};
