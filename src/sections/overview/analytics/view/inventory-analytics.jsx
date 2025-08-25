import { Link } from 'react-router-dom';
import { forwardRef, useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { Box, Container, Typography, Button, Select, FormControl, InputLabel } from '@mui/material';

// import AnalyticsCleaningTime from '../analytices-room-series';
// import AnalyticsVerticalChart from '../analytics-vertical-chart';
import AnalyticsInventoryShortage from '../analytics-inventory-shortages';
// import AnalyticsConversionRates from '../analytics-conversion-rates';
import AnalyticsItemRequestBreakdown from '../analytics-item-request-breakdown';
import RoomStatusDiscrepancyChart from '../analytics-room-status-descripancy-chart';

const InventoryAnalytics = forwardRef((props, ref) => {
  const theme = useTheme();
  // const [range, setRange] = useState('month'); // Filter: day | week | month | year

  const requestData = {
    day: [
      { item: 'Mop', timesRequested: 4 },
      { item: 'Bucket', timesRequested: 3 },
      { item: 'Gloves', timesRequested: 5 },
      { item: 'Towel', timesRequested: 2 },
      { item: 'Toilet Brush', timesRequested: 1 },
      { item: 'Broom', timesRequested: 2 },
    ],
    week: [
      { item: 'Mop', timesRequested: 12 },
      { item: 'Bucket', timesRequested: 9 },
      { item: 'Gloves', timesRequested: 14 },
      { item: 'Towel', timesRequested: 7 },
      { item: 'Toilet Brush', timesRequested: 4 },
      { item: 'Broom', timesRequested: 6 },
    ],
    month: [
      { item: 'Mop', timesRequested: 40 },
      { item: 'Bucket', timesRequested: 32 },
      { item: 'Gloves', timesRequested: 48 },
      { item: 'Towel', timesRequested: 25 },
      { item: 'Toilet Brush', timesRequested: 15 },
      { item: 'Broom', timesRequested: 20 },
    ],
    year: [
      { item: 'Mop', timesRequested: 145 },
      { item: 'Bucket', timesRequested: 120 },
      { item: 'Gloves', timesRequested: 160 },
      { item: 'Towel', timesRequested: 100 },
      { item: 'Toilet Brush', timesRequested: 80 },
      { item: 'Broom', timesRequested: 90 },
    ],
  };

  // Static data for different time ranges
  const requestVsAcceptedByMonth = {
    labels: ['R-101', 'R-102', 'R-103', 'R-104', 'R-105', 'R-106', 'R-107'],
    colors: ['#00B8D9', '#36B37E'], // Requested, Accepted
    series: [
      {
        name: 'Requested',
        data: [5000, 6000, 5500, 7000, 6500, 8000, 7500],
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
          Inventory Analytics
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/dashboard/inventory" variant="contained">
            View Inventory Overview
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        {/* Chart 1: MOP Quantity by Range */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsItemRequestBreakdown
              title="Item Usage"
              subheader="By frequency and quantity"
              data={requestData}
            />
          </Box>
        </Grid>

        {/* Chart 2: Requested vs Accepted */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <RoomStatusDiscrepancyChart
              title="Cost of Supplies per Room"
              subheader="Monthly comparison"
              chart={requestVsAcceptedByMonth}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsInventoryShortage
            title="Shortage Analytics"
            subheader="Measurements of waste or overuse of supplies"/>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
});

export default InventoryAnalytics;
