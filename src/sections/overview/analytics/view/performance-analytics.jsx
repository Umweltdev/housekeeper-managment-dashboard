import { Link } from 'react-router-dom';
import { useState, useRef, forwardRef } from 'react';

import { Box } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Button, Select, MenuItem, Card, CardContent, ToggleButton, ToggleButtonGroup, } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import RoomPriority from '../room-priority';
import AppAreaInstalled from '../app-area-installed';
import AppCurrentDownload from '../app-current-download';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsConversionRates from '../analytics-conversion-rates';
import AnalyticPeriodToggleChart from '../analytic-period-toggle-chart';
import AnalyticsCleaningTime from '../analytices-room-series';

// ----------------------------------------------------------------------

const PerformanceAnalytics = forwardRef((props, ref) => {
  const settings = useSettingsContext();
  const theme = useTheme();

  const [range, setRange] = useState('month'); // 'day' | 'month' | 'year'
  const [categoryFilter, setCategoryFilter] = useState('All');

  const userSatisfactionData = [
    { label: 'Very Satisfied', value: 60 },
    { label: 'Satisfied', value: 25 },
    { label: 'Neutral', value: 10 },
    { label: 'Unsatisfied', value: 5 },
  ];

  const chartRangeData = {
    day: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        {
          year: '2024',
          data: [
            { name: 'No of rooms cleaned', data: [5, 6, 7, 4, 6, 5, 3] },
            // { name: 'Inspected', data: [3, 5, 6, 2, 4, 5, 2] },
            // { name: 'Dirty', data: [2, 1, 2, 2, 1, 2, 3] },
          ],
        },
      ],
    },
    month: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      series: [
        {
          year: '2024',
          data: [
            { name: 'No of rooms cleaned', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49] },
            // { name: 'Inspected', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77] },
            // { name: 'Dirty', data: [40, 24, 33, 56, 47, 88, 99, 17, 45, 13, 96, 97] },
          ],
        },
        {
          year: '2025',
          data: [
            { name: 'No of rooms cleaned', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49] },
            // { name: 'Inspected', data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77] },
            // { name: 'Dirty', data: [20, 24, 53, 56, 47, 38, 99, 17, 65, 13, 96, 77] },
          ],
        },
      ],
    },
    year: {
      categories: ['2022', '2023', '2024'],
      series: [
        {
          year: 'Total',
          data: [
            { name: 'No of rooms cleaned', data: [300, 350, 400, 420, 450, 480] },
            // { name: 'Inspected', data: [280, 330, 390, 410, 440, 470] },
            // { name: 'Dirty', data: [100, 90, 85, 80, 75, 70] },
          ],
        },
      ],
    },
  };

  const priorityData = [
    { label: 'High', value: 5 },
    { label: 'Medium', value: 3 },
    { label: 'Low', value: 7 },
  ];

  const dataSet = [
        {
        period: "Day",
        data: [{ name: "Rooms", data: [45, 52, 47, 60, 58, 70, 65] }],
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        yLabel: "Rooms",
        },
        {
        period: "Week",
        data: [{ name: "Rooms", data: [320, 340, 310, 355] }],
        categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
        yLabel: "Rooms",
        },
        {
        period: "Month",
        data: [{ name: "Rooms", data: [1320, 1280, 1400, 1380, 1500] }],
        categories: ["Jan", "Feb", "Mar", "Apr", "May"],
        yLabel: "Rooms",
        },
        {
        period: "Year",
        data: [{ name: "Rooms", data: [13200, 12080, 14800, 19380, 19900] }],
        categories: ["2015", "2016", "2017", "2018", "2019"],
        yLabel: "Rooms",
        },
    ]


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={ref}>
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
          Room Cleaning Performance
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/dashboard/task" variant="contained">
            View Detailed Report
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Total Rooms Cleaned"
            total="80"
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/bed.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Avg Cleaning Time"
            total="40"
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            unit="min"
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Guest Satisfaction (NPS)"
            total="4"
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            unit="/5"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2, alignItems: 'stretch' }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <AnalyticPeriodToggleChart
                title="Rooms Cleaned Per - "
                subheader="Performance by timeframe"
                defaultPeriod="Day"
                
                datasets={dataSet}
                />

          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalyticsConversionRates
            sx={{ height: '100%' }}
            title="Average Cleaning Time per Room"
            subheader="(+12%) compared to last year"
            chart={{
              series: [
                { label: 'R-101', value: 42 },
                { label: 'R-102', value: 39 },
                { label: 'R-103', value: 41 },
                { label: 'R-104', value: 37 },
                { label: 'R-105', value: 44 },
                { label: 'R-106', value: 46 },
                { label: 'R-107', value: 49 },
                { label: 'R-108', value: 45 },
                { label: 'R-109', value: 43 },
                { label: 'R-201', value: 47 },
                { label: 'R-202', value: 40 },
                { label: 'R-203', value: 42 },
              ],
              options: {
                yaxis: {
                  labels: {
                    formatter: (value) => `${value}`,
                  },
                },
                tooltip: {
                  y: {
                    formatter: (value) => `${value} mins`,
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsCleaningTime
            title="Task Performance Index"
            subheader="Time taken to clean different room types (e.g., standard, suite)"/>
          </Box>
        </Grid>
        {/* <Grid item xs={12} md={8}>
          <Box sx={{ height: '100%' }}>
            <AppAreaInstalled
              title="Task Performance Index"
              subheader="Distribution of dirty, cleaned, and inspected tasks"
              chart={{
                categories: chartRangeData[range].categories,
                series:
                  chartRangeData[range].series.length > 1
                    ? chartRangeData[range].series
                    : [
                        {
                          year: 'Total',
                          data: chartRangeData[range].series[0].data,
                        },
                      ],
                colors: [
                  [theme.palette.success.light, theme.palette.success.main],
                  [theme.palette.info.light, theme.palette.info.main],
                  [theme.palette.error.light, theme.palette.error.main],
                ],
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ height: '100%' }}>
            <AppCurrentDownload
              title="Guest Satisfaction"
              subheader="Survey responses from recent guests"
              chart={{
                series: userSatisfactionData,
                colors: [
                  theme.palette.success.main,
                  theme.palette.info.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                ],
              }}
            />
          </Box>
        </Grid> */}
      </Grid>

      {/* <Grid container spacing={3} sx={{ mt: 2 }}>
        {' '}
        <Grid item xs={12} md={6}>
          <RoomPriority
            title="Room Priority Distribution"
            subheader="Static count of High, Medium, and Low"
            data={priorityData}
          />
        </Grid>
      </Grid> */}
    </Container>
  );
});

export default PerformanceAnalytics;
