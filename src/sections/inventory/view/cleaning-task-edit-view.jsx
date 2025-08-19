/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
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
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

const STATUS_COLORS = {
  'In Stock': 'success',
  'Out of Stock': 'error',
  'Low Stock': 'warning',
};

export default function CleaningTaskEditForm({ inventory }) {
  const router = useNavigate();

  const [itemName, setItemName] = useState(inventory.itemName || '');
  const [parLevel, setParLevel] = useState(inventory.parLevel || 0);
  const [quantity, setQuantity] = useState(inventory.quantity || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [edited, setEdited] = useState(false)

    useEffect(()=>{
       if( itemName === inventory.itemName && parLevel === inventory.parLevel && quantity === inventory.quantity){
        setEdited(false)
      }else{
        setEdited(true)
      }
    }, [inventory.itemName, inventory.parLevel, inventory.quantity, itemName, parLevel, quantity])
  

  const handleSaveChanges = () => {
    setIsSaving(false);
      setOpenSnackbar(true);
    if(!edited){
      // console.log('edit something!')
      return
    }
    setIsSaving(true);

    setTimeout(() => {

      setTimeout(() => {
        router('/dashboard/inventory');
      }, 1500);
    }, 1500);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} sx={{ maxHeight: 1000, overflowY: 'auto' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h2">
                Inventory: {inventory.itemName}
              </Typography>{' '}
              <Label
                variant="soft"
                color={STATUS_COLORS[inventory.status] || 'default'}
                sx={{ textTransform: 'capitalize' }}
              >
                {inventory.status}
              </Label>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {/* Inventory Name */}
              <TextField
                label="Inventory Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                fullWidth
              />
              {/* Par Level */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <TextField
                  label="Par Level"
                  type="number"
                  value={parLevel}
                  onChange={(e) => setParLevel(Number(e.target.value))}
                  fullWidth
                />
                <Chip label={inventory.parLevel} color="info" size="small" variant="soft" />
              </Stack>
              {/* Quantity */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  fullWidth
                />
                <Chip label={inventory.quantity} color="primary" size="small" variant="soft" />
              </Stack>
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
          onClick={() => router('/dashboard/inventory')}
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
          disabled={!edited || isSaving}
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
        <Alert onClose={() => setOpenSnackbar(false)} severity={edited ? 'success' : "error"} sx={{ width: '100%' }}>
          {edited ? 'Changes saved successfully!' : 'No changes were made!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

CleaningTaskEditForm.propTypes = {
  inventory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    requestDate: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    parLevel: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['In Stock', 'Out of Stock', 'Low Stock']).isRequired,
    requestedBy: PropTypes.string,
  }).isRequired,
};
