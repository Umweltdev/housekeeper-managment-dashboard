/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import {
  Box,
  Stack,
  Alert,
  Button,
  Divider,
  MenuItem,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, getComparator } from 'src/components/table';

import { useGetBookings } from 'src/api/booking';

import InvoiceListViewEdit from './invoice-list-viewEdit';
import InvoiceAnalytic from '../invoice-analytic';
import RequestInventoryListView from './request-inventory-list-view';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// MonthSelector component moved outside
const MonthSelector = ({ value, onChange }) => (
  <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
    <InputLabel>Month</InputLabel>
    <Select value={value} label="Month" onChange={(e) => onChange(e.target.value)}>
      <MenuItem value="all">All Months</MenuItem>
      <MenuItem value="1">January</MenuItem>
      <MenuItem value="2">February</MenuItem>
      <MenuItem value="3">March</MenuItem>
      <MenuItem value="4">April</MenuItem>
      <MenuItem value="5">May</MenuItem>
      <MenuItem value="6">June</MenuItem>
      <MenuItem value="7">July</MenuItem>
      <MenuItem value="8">August</MenuItem>
      <MenuItem value="9">September</MenuItem>
      <MenuItem value="10">October</MenuItem>
      <MenuItem value="11">November</MenuItem>
      <MenuItem value="12">December</MenuItem>
    </Select>
  </FormControl>
);

MonthSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function CleaningTaskEditForm({ task }) {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { bookings, refreshBookings } = useGetBookings([]);
  const [tableData, setTableData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('all');
  // const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const theme = useTheme();
  const [filters, setFilters] = useState(defaultFilters);
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    setTableData(bookings);
  }, [bookings]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstance.delete(`/api/booking/${id}`);
        enqueueSnackbar('Deleted Successfully!', { variant: 'success' });
        setTableData((prevData) => prevData.filter((row) => row._id !== id));
        refreshBookings();
      } catch (error) {
        console.error(error);
      }
    },
    [refreshBookings, enqueueSnackbar]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    enqueueSnackbar('Delete success!');
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  // Extract check-in dates
  const checkInDates = bookings
  // remove comments
    // .filter((booking) => booking.status === 'checkedIn')
    // .flatMap((booking) => booking.rooms.map((room) => new Date(room.checkIn || booking.createdAt)));

  // Calculate monthly averages
  const calculateMonthlyAverage = () => {
    if (checkInDates.length === 0) return 0;

    const filteredDates =
      selectedMonth === 'all'
        ? checkInDates
        : checkInDates.filter((date) => date.getMonth() + 1 === Number(selectedMonth));

    if (filteredDates.length === 0) return 0;

    const minDate = new Date(Math.min(...filteredDates));
    const maxDate = new Date(Math.max(...filteredDates));
    const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24) || 1;

    return (filteredDates.length / totalDays).toFixed(2);
  };

  const averageCheckInsPerDay = calculateMonthlyAverage();
  const averageCheckInsPerHour =
    checkInDates.length > 0 ? (averageCheckInsPerDay / 24).toFixed(2) : 0;

  const handleSaveChanges = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setOpenSnackbar(true);

      setTimeout(() => {
        router('/dashboard/inventory');
      }, 1500);
    }, 1500);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{}}>
          <CustomBreadcrumbs
            heading="Inventory"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              // { name: 'Check-In', href: paths.dashboard.booking.root },
              { name: 'List' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />

        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          // sx={{ py: 2 ,mb: 6 }}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          gap={2}
        >
          <InvoiceAnalytic
            title="Total Items"
            total={200}
            percent={5}
            price={0}
            icon="tdesign:task"
            color={theme.palette.info.main}
          />

          <InvoiceAnalytic
            title="In Stock"
            total={150}
            percent={50}
            price={0}
            icon="ic:round-check-circle"
            color={theme.palette.success.main}
          />

          <InvoiceAnalytic
            title="Low Stock"
            total={40}
            percent={15}
            price={0}
            icon="material-symbols:cancel"
            color={theme.palette.warning.main}
          />

          <InvoiceAnalytic
            title="Out of Stock"
            total={10}
            percent={10}
            price={0}
            icon="ph:package-bold"
            color={theme.palette.error.main}
          />
        </Stack>
        {/* </Card> */}
        {/* <InvoiceListViewEdit /> */}
        <RequestInventoryListView/>
      </Container>
      {/* Footer */}
      {/* <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
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
          disabled={isSaving}
          sx={{ minWidth: 140 }}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box> */}

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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
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

function applyFilter({ inputData, comparator, filters }) {
  // remove the if statement
  if(!inputData.lenght){
    return []
  }
  const { name, status } = filters;

  let filteredData = inputData.map((el, index) => [el, index]);
  filteredData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  filteredData = filteredData.map((el) => el[0]);

  filteredData = filteredData.filter((booking) => booking.status === 'paid');

  if (name) {
    filteredData = filteredData.filter((booking) =>
      booking.customer.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((booking) => booking.status === status);
  }

  return filteredData;
}

// InventoryListView.propTypes = {
//   // Add any props your component receives here
// };
  