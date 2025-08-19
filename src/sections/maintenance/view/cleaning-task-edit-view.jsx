import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

// Material UI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Alert, MenuItem, Snackbar } from '@mui/material';

// Custom Components
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { CLEANING_TASKS } from './maintenance-tasks';

export default function UserNewEditForm({ maintenance }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [assignee, setAssignee] = useState(maintenance.requestedBy || '')
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [status, setStatus] = useState(maintenance.status || '')
  const [edit, setEdited] = useState(false)

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

  

  const handleSaveChanges = () => {
    if(!values.issue && !values.room && assignee === maintenance.requestedBy && status === maintenance.status){
      enqueueSnackbar('No changes were made!', { variant: 'error' });
      return
    }
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
              Edit Maintenance Progress - #{maintenance.itemName}
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
                <RHFTextField name="room" label={maintenance.itemName || "Room/Area"} fullWidth />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="issue" label={maintenance.issue || "Maintenance Description"} fullWidth />
              </Grid>
              <Grid xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Maintenance progress"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
          </Card>
        </Grid>
      </Grid>
      <div className='mt-6'>
        <Grid xs={12} marginTop={3}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" 
              onClick={() => router.push('/dashboard/maintenance')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        </Grid>
      </div>
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
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  maintenance: PropTypes.object,
};