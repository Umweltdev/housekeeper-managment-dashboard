import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate, fTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function CleaningTaskTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onMoveToInspected,
}) {
  const { room, category, description, assignedTo, dueDate, priority, status } = row;

  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const popover = usePopover();
  const [markingInspected, setMarkingInspected] = useState(false);

  const canMarkAsInspected = status === 'cleaned' || status === 'inspected';

  const handleMarkAsInspected = async () => {
    setMarkingInspected(true);
    try {
      const response = await axios.patch(`/api/tasks/${row.id}/markAsInspected`);
      if (response.data.success) {
        const newStatus = response.data.data.status.statusType;
        onMoveToInspected(row.id, newStatus);
        enqueueSnackbar(`Task marked as ${newStatus}!`, { variant: 'success' });
      } else {
        enqueueSnackbar(response.data.error || 'Failed to update task', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to update task', { variant: 'error' });
    } finally {
      setMarkingInspected(false);
      popover.onClose();
    }
  };

  const tooltipInspected = (() => {
    if (canMarkAsInspected) return '';
    return 'Cannot mark this task as inspected';
  })();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{room}</TableCell>
        <TableCell>{category}</TableCell>
        <TableCell sx={{ width: '18rem' }}>{description}</TableCell>
        <TableCell>{assignedTo}</TableCell>

        <TableCell>
          <Typography variant="body2">{dueDate ? fDate(dueDate) : 'N/A'}</Typography>
          <Typography variant="caption" color="text.secondary">
            {dueDate ? fTime(dueDate) : 'N/A'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body2"
            sx={{
              color:
                (priority === 'High' && 'error.main') ||
                (priority === 'Medium' && 'warning.main') ||
                (priority === 'Low' && 'success.main') ||
                'text.primary',
              fontWeight: 600,
            }}
          >
            {priority}
          </Typography>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'cleaned' && 'success') ||
              (status === 'dirty' && 'error') ||
              (status === 'inspected' && 'info') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <Tooltip title={tooltipInspected}>
          <span>
            <MenuItem
              disabled={markingInspected || !canMarkAsInspected}
              onClick={handleMarkAsInspected}
              sx={{
                bgcolor: 'info.main',
                color: 'common.white',
                borderRadius: 1,
                my: 1,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'info.dark',
                },
                opacity: !canMarkAsInspected ? 0.5 : 1,
              }}
            >
              {markingInspected ? (
                <Iconify icon="eos-icons:loading" width={20} />
              ) : (
                <Iconify icon="mdi:clipboard-check" />
              )}
              Mark as {status === 'inspected' ? 'Cleaned' : 'Inspected'}
            </MenuItem>
          </span>
        </Tooltip>

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
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
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

CleaningTaskTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onMoveToInspected: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
