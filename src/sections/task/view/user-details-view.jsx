/* eslint-disable spaced-comment */

import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useGetRooms } from 'src/api/room';
import { useGetRoomTypes } from 'src/api/roomType';
import { useGetUsers } from 'src/api/user';
import axiosInstance from 'src/utils/axios';

const STATUS_OPTIONS = ['dirty', 'cleaned', 'inspected'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

export default function TaskCreateView() {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { rooms, roomsLoading, roomsError } = useGetRooms();
  const { roomTypes, roomTypesLoading, roomTypesError } = useGetRoomTypes();
  const { users, usersLoading, usersError } = useGetUsers();

  console.log('rooms list', rooms, 'roomsError', roomsError);
  console.log('roomTypes list', roomTypes, 'roomTypesError', roomTypesError);
  console.log('user list', users, 'usersError', usersError);

  const [formData, setFormData] = useState({
    roomId: '',
    roomType: 'Unknown',
    roomTypeId: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'dirty',
    assignedTo: '',
    type: 'cleaning',
    createDate: new Date().toISOString().slice(0, 16),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Log formData changes for debugging
  useEffect(() => {
    console.log('formData updated:', formData);
  }, [formData]);

  // Filter rooms where isClean is false
  const dirtyRooms = rooms ? rooms.filter((room) => !room.isClean) : [];

  // Filter housekeepers
  const housekeepers = users ? users.filter((user) => user.role === 'housekeeper') : [];

  // Get room type image
  const selectedRoomType = roomTypes?.find((type) => type._id === formData.roomTypeId);
  const roomImage =
    selectedRoomType?.images?.[0] || 'https://via.placeholder.com/300x150?text=No+Image';

  // Auto-fill roomType and roomTypeId when roomId changes
  useEffect(() => {
    if (rooms && roomTypes && formData.roomId) {
      const selectedRoom = rooms.find((room) => room._id === formData.roomId);
      if (selectedRoom?.roomType) {
        const roomTypeData = roomTypes.find((type) => type._id === selectedRoom.roomType);
        setFormData((prev) => ({
          ...prev,
          roomType: roomTypeData?.title || 'Unknown',
          roomTypeId: roomTypeData?._id || '',
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          roomType: 'Unknown',
          roomTypeId: '',
        }));
      }
    }
  }, [formData.roomId, rooms, roomTypes]);

  const handleReset = useCallback(() => {
    setFormData({
      roomId: '',
      roomType: 'Unknown',
      roomTypeId: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'dirty',
      assignedTo: '',
      type: 'cleaning',
      createDate: new Date().toISOString().slice(0, 16),
    });
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        status: {
          statusType: formData.status,
          description: formData.description,
          maintenanceAndDamages: [],
          detailedIssues: [],
        },
        roomId: formData.roomId || '',
        housekeeperId: formData.assignedTo || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        priority: formData.priority.toLowerCase(),
        roomType: formData.roomTypeId
          ? { _id: formData.roomTypeId, title: formData.roomType }
          : null,
        type: formData.type,
      };

      console.log('Submitting payload:', payload);

      const response = await axiosInstance.post('/api/task', payload);
      if (response.data.success) {
        enqueueSnackbar('Task created successfully!', { variant: 'success' });
        setTimeout(() => {
          navigate(paths.dashboard.task.root);
        }, 1500);
      } else {
        setError(response.data.error || 'Failed to create task');
      }
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setIsSaving(false);
    }
  }, [formData, enqueueSnackbar, navigate]);

  if (roomsLoading || roomTypesLoading || usersLoading) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create Cleaning Task"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Room Cleaning Assignments', href: paths.dashboard.task.root },
          { name: 'Create Task' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={4}>
        {/* Left: Task Creation Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Stack spacing={3}>
              <TextField
                select
                fullWidth
                label="Room Number"
                value={formData.roomId}
                onChange={(e) => setFormData((prev) => ({ ...prev, roomId: e.target.value }))}
              >
                {dirtyRooms.length ? (
                  dirtyRooms.map((room) => (
                    <MenuItem key={room._id} value={room._id}>
                      {room.roomNumber}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No dirty rooms available
                  </MenuItem>
                )}
              </TextField>

              <TextField
                fullWidth
                label="Room Type"
                value={formData.roomType}
                InputProps={{ readOnly: true }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />

              <TextField
                type="datetime-local"
                fullWidth
                label="Due Date"
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              />

              <TextField
                select
                fullWidth
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Assigned To"
                value={formData.assignedTo}
                onChange={(e) => setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))}
              >
                <MenuItem value="">None</MenuItem>
                {housekeepers.length ? (
                  housekeepers.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No housekeepers available
                  </MenuItem>
                )}
              </TextField>

              {housekeepers.length === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No housekeepers available. Please assign users with the housekeeper role.
                </Alert>
              )}

              <Divider />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleReset}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  startIcon={
                    isSaving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Iconify icon="eva:save-fill" />
                    )
                  }
                  disabled={isSaving || !formData.roomId}
                  sx={{ minWidth: 140 }}
                >
                  {isSaving ? 'Saving...' : 'Create Task'}
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Right: Task Preview */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.main',
                borderRadius: '8px 8px 0 0',
                mb: 2,
              }}
            >
              <Typography variant="h5" color="white" fontWeight="medium">
                Task Preview
              </Typography>
            </Box>

            <Box
              component="img"
              src={roomImage}
              alt="Room Type"
              sx={{
                width: '100%',
                height: 150,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            />

            <Stack spacing={1} sx={{ pb: 2, flexGrow: 1 }}>
              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                }}
              >
                <Stack direction="row" alignItems="top" spacing={1}>
                  <Iconify icon="eva:home-fill" width={20} />
                  <Box>
                    <Typography variant="body2">Room</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {dirtyRooms.find((r) => r._id === formData.roomId)?.roomNumber || '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                }}
              >
                <Stack direction="row" alignItems="top" spacing={1}>
                  <Iconify icon="eva:grid-fill" width={20} />
                  <Box>
                    <Typography variant="body2">Room Type</Typography>
                    <Typography variant="body2">{formData.roomType || '-'}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                }}
              >
                <Stack direction="row" alignItems="top" spacing={1}>
                  <Iconify icon="eva:file-text-fill" width={20} />
                  <Box>
                    <Typography variant="body2">Description</Typography>
                    <Typography variant="body2">{formData.description || '-'}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                }}
              >
                <Stack direction="row" alignItems="top" spacing={1}>
                  <Iconify icon="eva:calendar-fill" width={20} />
                  <Box>
                    <Typography variant="body2">Due Date</Typography>
                    <Typography variant="body2">
                      {formData.dueDate ? new Date(formData.dueDate).toLocaleString() : '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                }}
              >
                <Stack direction="row" alignItems="top" spacing={1}>
                  <Iconify icon="eva:alert-circle-fill" width={20} />
                  <Box>
                    <Typography variant="body2">Priority</Typography>
                    <Typography variant="body2">{formData.priority || '-'}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                }}
              >
                <Stack direction="row" alignItems="top" spacing={1}>
                  <Iconify icon="eva:checkmark-circle-2-fill" width={20} />
                  <Box>
                    <Typography variant="body2">Status</Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {formData.status || '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                }}
              >
                <Stack direction="row" alignItems="top" spacing={1}>
                  <Iconify icon="eva:person-fill" width={20} />
                  <Box>
                    <Typography variant="body2">Assigned To</Typography>
                    <Typography variant="body2">
                      {housekeepers.find((u) => u._id === formData.assignedTo)?.name || '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

TaskCreateView.propTypes = {};
