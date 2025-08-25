"use client";

import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";

import { success } from "src/theme/palette";

import PeriodToggleChart from "./analytic-period-toggle-chart"; // optional custom palette

// ----------------------------------------------------------------------

export default function AnalyticsCleaningTime({ title, subheader }) {
  const theme = useTheme();

  return (
    <PeriodToggleChart
      title={title}
      subheader={subheader}
      defaultPeriod="Day"
      datasets={[
        {
          period: "Day",
          data: [
            { name: "Standard Room", data: [25, 22, 24, 23, 26, 21, 20] },
            { name: "Suite", data: [40, 42, 39, 41, 43, 38, 37] },
          ],
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          yLabel: "Minutes per room",
          type: "bar", // bar works better for comparing multiple series
          options: {
            colors: [theme.palette.primary.main, success.main],
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "45%",
                endingShape: "rounded",
              },
            },
            tooltip: {
              shared: true,
              intersect: false,
              y: {
                formatter: (value) => `${value} min`,
              },
            },
          },
        },
        {
          period: "Week",
          data: [
            { name: "Standard Room", data: [165, 158, 170, 160] },
            { name: "Suite", data: [280, 290, 275, 285] },
          ],
          categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
          yLabel: "Minutes per room",
          type: "bar",
          options: {
            colors: [theme.palette.primary.main, success.main],
          },
        },
        {
          period: "Month",
          data: [
            { name: "Standard Room", data: [700, 720, 710, 690, 740] },
            { name: "Suite", data: [1200, 1180, 1220, 1190, 1230] },
          ],
          categories: ["Jan", "Feb", "Mar", "Apr", "May"],
          yLabel: "Minutes per room",
          type: "bar",
          options: {
            colors: [theme.palette.primary.main, success.main],
          },
        },
      ]}
    />
  );
}

AnalyticsCleaningTime.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};
