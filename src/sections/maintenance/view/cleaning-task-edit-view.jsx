import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

// Material UI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Custom Components
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import CheckoutPage from '../CheckoutPage';
import { CLEANING_TASKS } from './cleaning-tasks';

export default function UserNewEditForm({ task }) {
  const router = useRouter();
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [assignee, setAssignee] = useState('')
  const [area, setArea] = useState('')
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const methods = useForm({
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    handleSaveChanges()
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

  const handleCloseCheckoutModal = () => {
    setOpenCheckoutModal(false);
  };

    const handleSaveChanges = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setOpenSnackbar(true);

      setTimeout(() => {
        router.push('/dashboard/maintenance');
      }, 1500);
    }, 1500);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Left Column - User Details */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Maintenance Progress - #{task.itemName}
            </Typography>
            <Divider sx={{ mb: 3 }} />

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
                <RHFTextField name="lastName" label="Room/Area" fullWidth />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="lastName" label="Task Description" fullWidth />
              </Grid>
              <Grid xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Maintenance progress"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
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
          <Card sx={{ p: 3 }}>
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
          </Card>
        </Grid>
      </Grid>

      {/* Checkout Modal */}
      <Dialog
        open={openCheckoutModal}
        onClose={handleCloseCheckoutModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <CheckoutPage roomDetails={roomDetails} additionalCharges={additionalCharges} />
      </Dialog>
        <div className='mt-6'>
          <Grid xs={12} marginTop={3}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" 
                onClick={()=> router.push('/dashboard/maintenance')}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                >
                  Edit Request
                </Button>
              </Stack>
            </Grid>
        </div>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  task: PropTypes.object,
};