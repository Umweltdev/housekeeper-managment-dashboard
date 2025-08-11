/* eslint-disable spaced-comment */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

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

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';

export default function UserDetailsView({ id }) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  // Mock staff list (replace with API data)
  const staffList = ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'Chris Johnson'];

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    room: '',
    category: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
    assignedTo: '',
    type: 'cleaning',
    createDate: new Date().toISOString().slice(0, 16),
  });

  const handleReset = () => {
    setFormData({
      room: '',
      category: '',
      description: '',
      dueDate: '',
      priority: '',
      status: '',
      assignedTo: '',
      type: 'cleaning',
      createDate: new Date().toISOString().slice(0, 16),
    });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1500));
      enqueueSnackbar('Task created successfully!', { variant: 'success' });
      console.log('Submitting task:', formData);
      router.push(paths.dashboard.user.list);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create Cleaning Task"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Room Cleaning Assignments', href: paths.dashboard.user.list },
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
                fullWidth
                label="Room Number"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />

              <TextField
                select
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Deluxe">Deluxe</MenuItem>
                <MenuItem value="Suite">Suite</MenuItem>
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <TextField
                type="datetime-local"
                fullWidth
                label="Due Date"
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />

              <TextField
                select
                fullWidth
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="dirty">Dirty</MenuItem>
                <MenuItem value="cleaned">Cleaned</MenuItem>
                <MenuItem value="inspected">Inspected</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Assigned To"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              >
                {staffList.map((staff, index) => (
                  <MenuItem key={index} value={staff}>
                    {staff}
                  </MenuItem>
                ))}
              </TextField>

              <Divider />

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
                  disabled={isSaving || !formData.room || !formData.assignedTo}
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
          <Card sx={{ p: 3, boxShadow: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Task Preview
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Room
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formData.room || '-'}
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography>{formData.category || '-'}</Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography>{formData.description || '-'}</Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Due Date
                </Typography>
                <Typography>
                  {formData.dueDate ? new Date(formData.dueDate).toLocaleString() : '-'}
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Priority
                </Typography>
                <Typography>{formData.priority || '-'}</Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Typography sx={{ textTransform: 'capitalize' }}>
                  {formData.status || '-'}
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Assigned To
                </Typography>
                <Typography>{formData.assignedTo || '-'}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

UserDetailsView.propTypes = {
  id: PropTypes.string,
};
