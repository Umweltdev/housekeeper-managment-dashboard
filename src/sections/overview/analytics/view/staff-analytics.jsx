import { Link } from 'react-router-dom';
import { useState, forwardRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';

import AnalyticesToggleStackBar from '../analytics-toggle-stack-bar';
import AnalyticPeriodToggleChart from '../analytic-period-toggle-chart';
import AnalyticsItemRequestBreakdown from '../analytics-item-request-breakdown';

const StaffAnalysis = forwardRef((props, ref) => {
  const theme = useTheme();
  const [range, setRange] = useState('month'); // Filter: day | week | month | year

  const requestData = {
    day: [
      { item: 'John', timesRequested: 4 },
      { item: 'Jane', timesRequested: 3 },
      { item: 'David', timesRequested: 5 },
      { item: 'Joshua', timesRequested: 2 },
      { item: 'Emmanuel', timesRequested: 1 },
      { item: 'Jack', timesRequested: 2 },
    ],
    week: [
      { item: 'John', timesRequested: 12 },
      { item: 'Jane', timesRequested: 9 },
      { item: 'David', timesRequested: 14 },
      { item: 'Joshua', timesRequested: 7 },
      { item: 'Emmanuel', timesRequested: 4 },
      { item: 'Jack', timesRequested: 6 },
    ],
    month: [
      { item: 'John', timesRequested: 40 },
      { item: 'Jane', timesRequested: 32 },
      { item: 'David', timesRequested: 48 },
      { item: 'Joshua', timesRequested: 25 },
      { item: 'Emmanuel', timesRequested: 15 },
      { item: 'Jack', timesRequested: 20 },
    ],
    year: [
      { item: 'John', timesRequested: 145 },
      { item: 'Jane', timesRequested: 120 },
      { item: 'David', timesRequested: 160 },
      { item: 'Joshua', timesRequested: 100 },
      { item: 'Emmanuel', timesRequested: 80 },
      { item: 'Jack', timesRequested: 90 },
    ],
  };

  const requestVsAcceptedByMonth = {
    day: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        colors: ['#00B8D9', '#36B37E'], // Requested, Accepted
        series: [
        {
            name: 'Total Hours',
            data: [50, 60, 55, 70, 65, 80, 75],
        },
        {
            name: 'Overtime',
            data: [15, 15, 10, 25, 10, 22, 10],
        },
        ],
    },
    week: {
        labels: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6', 'Week7'],
        colors: ['#00B8D9', '#36B37E'], // Total Hours, Overtime
        series: [
        {
            name: 'Total Hours',
            data: [50, 60, 55, 70, 65, 80, 75],
        },
        {
            name: 'Overtime',
            data: [34, 35, 20, 35, 40, 32, 60],
        },
        ],
    },
    month: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        colors: ['#00B8D9', '#36B37E'], // Total Hours, Overtime
        series: [
        {
            name: 'Total Hours',
            data: [50, 60, 55, 70, 30, 80, 75],
        },
        {
            name: 'Overtime',
            data: [60, 55, 50, 65, 60, 72, 70],
        },
        ],
    },
    year: {
        labels: ['2000', '2001', '2002', '2003', '2004', '2005', '2006'],
        colors: ['#00B8D9', '#36B37E'], // Total Hours, Overtime
        series: [
        {
            name: 'Total Hours',
            data: [50, 60, 55, 70, 65, 80, 75],
        },
        {
            name: 'Overtime',
            data: [145, 155, 150, 215, 110, 172, 170],
        },
        ],
    }
  };

  const totalhoursVsAbsent = {
    day: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        colors: ['#00B8D9', '#36B37E'], // Requested, Accepted
        series: [
        {
            name: 'Total Hours',
            data: [15, 15, 10, 25, 10, 22, 10],
        },
        {
            name: 'Abscent Hours',
            data: [50, 60, 55, 70, 65, 80, 75],
        },
        ],
    },
    week: {
        labels: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6', 'Week7'],
        colors: ['#00B8D9', '#36B37E'], // Total Hours, Abscent Hours
        series: [
        {
            name: 'Total Hours',
            data: [34, 35, 20, 35, 40, 32, 60],
        },
        {
            name: 'Abscent Hours',
            data: [50, 60, 55, 70, 65, 80, 75],
        },
        ],
    },
    month: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        colors: ['#00B8D9', '#36B37E'], // Total Hours, Abscent Hours
        series: [
        {
            name: 'Total Hours',
            data: [60, 55, 50, 65, 60, 72, 70],
        },
        {
            name: 'Abscent Hours',
            data: [50, 60, 55, 70, 30, 80, 75],
        },
        ],
    },
    year: {
        labels: ['2000', '2001', '2002', '2003', '2004', '2005', '2006'],
        colors: ['#00B8D9', '#36B37E'], // Total Hours, Abscent Hours
        series: [
        {
            name: 'Total Hours',
            data: [145, 155, 150, 215, 110, 172, 170],
        },
        {
            name: 'Abscent Hours',
            data: [50, 60, 55, 70, 65, 80, 75],
        },
        ],
    }
  };


  const dataSet = [
        {
        period: "Day",
        data: [{ name: "Number of Rooms", data: [45, 52, 47, 60, 58, 70, 65] }],
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        yLabel: "Number of Rooms",
        },
        {
        period: "Week",
        data: [{ name: "Rooms", data: [320, 340, 310, 355] }],
        categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
        yLabel: "Number of Rooms",
        },
        {
        period: "Month",
        data: [{ name: "Number of Rooms", data: [1320, 1280, 1400, 1380, 1500] }],
        categories: ["Jan", "Feb", "Mar", "Apr", "May"],
        yLabel: "Number of Rooms",
        },
        {
        period: "Year",
        data: [{ name: "Number of Rooms", data: [13200, 12080, 14800, 19380, 19900] }],
        categories: ["2015", "2016", "2017", "2018", "2019"],
        yLabel: "Number of Rooms",
        },
    ]

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
          Housekeeping Staff Productivity
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/dashboard/inventory" variant="contained">
            View Detailed Report
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        {/* Chart 1: MOP Quantity by Range */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsItemRequestBreakdown
              title="Total Hours Worked Overview"
              subheader="By amount of hours worked"
              data={requestData}
            />
          </Box>
        </Grid>

        {/* Chart 2: Total Hours vs Accepted */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <AnalyticesToggleStackBar
              title="Total Hours vs Overtime"
              subheader="Houly Interval Comparison"
              chart={requestVsAcceptedByMonth[range]}
              range={range}
              setRange={setRange}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box sx={{ height: '100%' }}>
            <AnalyticPeriodToggleChart
              title="Rooms Cleaned Per - "
              subheader="Performance by timeframe"
              defaultPeriod="Day"
              
              datasets={dataSet}
              />
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <AnalyticesToggleStackBar
              title="Total Hours vs Absent Hours"
              subheader="Houly Interval Comparison"
              chart={totalhoursVsAbsent[range]}
              range={range}
              setRange={setRange}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
});

export default StaffAnalysis;
