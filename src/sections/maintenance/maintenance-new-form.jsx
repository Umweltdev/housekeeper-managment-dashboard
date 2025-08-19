import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

// Material UI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import { MenuItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

// Custom Components
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import makeToast from '../tour/assets/toaster';
import { CLEANING_TASKS } from './view/maintenance-tasks';

export default function UserNewEditForm({ currentUser }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [assignee, setAssignee] = useState('')
  const [progress, setProgress] = useState('')

  const NewIssueSchema = Yup.object().shape({
    room: Yup.string().required('Room/Area is required!'),
    issue: Yup.string().required('Please attach the issue'),
  });

  const methods = useForm({
    resolver: yupResolver(NewIssueSchema),
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    try {
      if(!assignee){
        enqueueSnackbar('Please assign task!', { variant: 'error' });
        return
      }

      if(!progress){
        enqueueSnackbar('Please select progress', { variant: 'error' });
        return
      }
      // if (currentUser) {
      //   await axiosInstance.put(`/api/user/${currentUser._id}`, formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      // } else {
      //   await axiosInstance.post(`/api/auth/register`, formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      // }
      reset();
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      setTimeout(() => {
        router.push(paths.dashboard.maintenance.root);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('img', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleCheckIn = async () => {
    try {
      

      await axiosInstance.put(`/api/booking/${currentUser._id}`, {
        status: 'checkedIn',
      });

      enqueueSnackbar('Booking status updated to checked-in!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to update booking status.', { variant: 'error' });
    }
  };

  const handleOpenCheckoutModal = async () => {
    await handleCheckIn();

    if (!additionalCharges || additionalCharges <= 0) {
      makeToast('success', 'Customer successfully checked in');
      return;
    }

    setRoomDetails({
      roomName: values.rooms[0]?.roomType || '',
      roomNumber: values.rooms[0]?.roomNumber || '',
      roomImg: values.rooms[0]?.roomImg || '',
      price: values.rooms[0]?.amount || 0,
      checkInDate: new Date().toISOString().split('T')[0],
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split('T')[0],
    });
    setOpenCheckoutModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'checked-in':
        return 'success';
      case 'reserved':
        return 'warning';
      case 'checked-out':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Left Column - User Details */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Assign and Track Progress
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {currentUser && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Chip
                  label={values.status}
                  color={getStatusColor(values.status)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}



            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Assign To"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                >
                  {
                    [...new Set(CLEANING_TASKS.map(item => item.requestedBy))].map((name, idx) => (
                      <MenuItem value={name} key={idx}>
                        {name}
                      </MenuItem>
                    ))
                  }

                </TextField>
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="room" label="Room/Area" fullWidth />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="issue" label="Task Description" fullWidth />
              </Grid>
              <Grid xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Maintenance progress"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                >
                  {
                    [...new Set(CLEANING_TASKS.map(item => item.status))].map((name, idx) => (
                      <MenuItem value={name} key={idx}>
                        {name}
                      </MenuItem>
                    ))
                  }

                </TextField>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Right Column - Room Details */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Attach maintenance image
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <RHFUploadAvatar
                name="img"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              startIcon={<Iconify icon="eva:checkmark-circle-2-outline" />}
            >
              Create Maintenance Request
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
