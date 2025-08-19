import PropTypes from 'prop-types';
import { useState } from 'react';

import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Stack } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function RequestInventoryTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}) {
  const { itemName, requestDate, quantity, status, parLevel, requestedBy } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  // Local loading states
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const handleApprove = async () => {
    setLoadingApprove(true);
    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: call your API or parent callback here
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleReject = async () => {
    setLoadingReject(true);
    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: call your API or parent callback here
    } finally {
      setLoadingReject(false);
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{itemName}</TableCell>
        <TableCell>
          <Typography variant="body2">{fDate(requestDate)}</Typography>
        </TableCell>
        <TableCell>{quantity}</TableCell>
        <TableCell>{parLevel}</TableCell>
        <TableCell>{requestedBy}</TableCell>
        {/* <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'Approved' && 'success') ||
              (status === 'Requested' && 'warning') ||
              (status === 'Rejected' && 'error') ||
              (status === 'Received' && 'info') ||
              'default'
            }
          >
            {status === 'Requested' ? 'Pending' : status}
          </Label>
        </TableCell> */}

        <TableCell align="center" sx={{ px: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="center">
            {/* Approve Button */}
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={loadingApprove || status === 'Approved' || status === 'Received'}
              onClick={handleApprove}
              sx={{
                minWidth: 90,
                height: 28,
                fontSize: '0.7rem',
                textTransform: 'capitalize',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                px: 1,
                py: 0.2,
              }}
            >
              {loadingApprove ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <>
                  <Iconify icon="material-symbols:check-circle-rounded" width={14} height={14} />
                  Approve
                </>
              )}
            </Button>

            {/* Reject Button */}
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={loadingReject || status === 'Rejected' || status === 'Received'}
              onClick={handleReject}
              sx={{
                minWidth: 90,
                height: 28,
                fontSize: '0.7rem',
                textTransform: 'capitalize',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                px: 1,
                py: 0.2,
              }}
            >
              {loadingReject ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <>
                  <Iconify icon="material-symbols:cancel" width={14} height={14} />
                  Reject
                </>
              )}
            </Button>
          </Stack>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          disabled={status !== 'Requested'}
        >
          <Iconify icon="fluent:delete-28-regular" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

RequestInventoryTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
