import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Container, Typography, Button, Select, FormControl, InputLabel } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import AnalyticsConversionRates from '../analytics-conversion-rates';
import AnalyticsVerticalChart from '../analytics-vertical-chart';
import AnalyticsItemRequest from '../analytics-item-request';
import RoomStatusDiscrepancyChart from '../analytics-room-status-descripancy-chart';
import MaintenanceRequestChart from '../analytics-maintenance-list';
import AnalyticsMaintenanceRecurring from '../analytic-maintenance-reccuring';
import ParetoChart from '../analytics-pareto-chart';

const MaintenanceAnalytics = forwardRef((props, ref) => {
  const theme = useTheme();
  const [range, setRange] = useState('month'); // Filter: day | week | month | year

  const requestData = {
    day: [
      { item: 'Plumbing', timesRequested: 4 },
      { item: 'Electrical', timesRequested: 3 },
      { item: 'Gardning', timesRequested: 5 },
      { item: 'Laundry', timesRequested: 2 },
      { item: 'Tiling', timesRequested: 1 },
      { item: 'Carpentry', timesRequested: 2 },
    ],
    week: [
      { item: 'Plumbing', timesRequested: 12 },
      { item: 'Electrical', timesRequested: 9 },
      { item: 'Gardning', timesRequested: 14 },
      { item: 'Laundry', timesRequested: 7 },
      { item: 'Tiling', timesRequested: 4 },
      { item: 'Carpentry', timesRequested: 6 },
    ],
    month: [
      { item: 'Plumbing', timesRequested: 40 },
      { item: 'Electrical', timesRequested: 32 },
      { item: 'Gardning', timesRequested: 48 },
      { item: 'Laundry', timesRequested: 25 },
      { item: 'Tiling', timesRequested: 15 },
      { item: 'Carpentry', timesRequested: 20 },
    ],
    year: [
      { item: 'Plumbing', timesRequested: 145 },
      { item: 'Electrical', timesRequested: 120 },
      { item: 'Gardning', timesRequested: 160 },
      { item: 'Laundry', timesRequested: 100 },
      { item: 'Tiling', timesRequested: 80 },
      { item: 'Carpentry', timesRequested: 90 },
    ],
  };

  const resolutionData = {
    day: [
      { item: 'Plumbing', timesRequested: 4 },
      { item: 'Electrical', timesRequested: 3 },
      { item: 'Gardning', timesRequested: 5 },
      { item: 'Laundry', timesRequested: 2 },
      { item: 'Tiling', timesRequested: 1 },
      { item: 'Carpentry', timesRequested: 2 },
    ],
  };

  // Static data for different time ranges
  const requestVsAcceptedByMonth = {
    labels: ['Electrical', 'Plumbing', 'Gardning', 'Laundry', 'Tiling', 'Carpentry'],
    colors: ['#00B8D9', '#36B37E'], // Requested, Accepted
    series: [
      {
        name: 'Requested',
        data: [5, 6, 9, 7, 6, 8],
      },
      // {
      //   name: 'Accepted',
      //   data: [45, 55, 50, 65, 60, 72, 70],
      // },
    ],
  };

  return (
    <Container maxWidth="xl" ref={ref}>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ mt: 5 }}>
          Maintenance Analytics
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/dashboard/maintenance" variant="contained">
            View Inventory Overview
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        {/* Chart 1: MOP Quantity by Range */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <MaintenanceRequestChart
             title="Maintenance Requests"
              subheader="Number of maintenance requests submitted by housekeeping"
              data={requestData}/>
          </Box>
        </Grid>

        {/* Chart 1: MOP Quantity by Range */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsItemRequest
              title="Request Types and Resolution"
              subheader="Types of Request and time taken to resolve them (Per hour)"
              data={resolutionData}
            />
          </Box>
        </Grid>

        {/* Chart 2: Requested vs Accepted */}
        <Grid xs={12} md={8}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsMaintenanceRecurring
              title="Recurring Maintenance Problems in Specific Rooms"
              subheader="Monthly comparison"
              data={requestData}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
});

export default MaintenanceAnalytics;
