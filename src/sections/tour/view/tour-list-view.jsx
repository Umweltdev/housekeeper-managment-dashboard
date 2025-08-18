/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetRoomTypes } from 'src/api/roomType';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TourList from '../tour-list';
import AnalyticTable from './analytic-table';

// import TourFilters from '../tour-filters';
// import TourFiltersResult from '../tour-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  // destination: [],
  // tourGuides: [],
  // services: [],
  // startDate: null,
  // endDate: null,
  publish: 'all',
};

// ----------------------------------------------------------------------

export default function TourListView() {
  const settings = useSettingsContext();

  // const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');



  const { roomTypes, refreshRoomsTypes } = useGetRoomTypes();

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: roomTypes,
    filters,
    sortBy,
    // dateError,
  });



  const notFound = !dataFiltered?.length;





  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Room Categories"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Room',
            href: paths.dashboard.room.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.room.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Category
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <AnalyticTable />
        {/* {renderFilters} */}

        {/* {renderResults} */}
      </Stack>

      {notFound && <EmptyContent title="No Data" filled sx={{ py: 10 }} />}

      <TourList tours={dataFiltered} refreshRoomsTypes={refreshRoomsTypes} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy, dateError }) => {
  const { publish } = filters;

  // const tourGuideIds = tourGuides.map((tourGuide) => tourGuide.id);

  // // SORT BY
  // if (sortBy === 'latest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['desc']);
  // }

  // if (sortBy === 'oldest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['asc']);
  // }

  // if (sortBy === 'popular') {
  //   inputData = orderBy(inputData, ['totalViews'], ['desc']);
  // }

  // // FILTERS
  // if (destination.length) {
  //   inputData = inputData.filter((tour) => destination.includes(tour.destination));
  // }

  // if (tourGuideIds.length) {
  //   inputData = inputData.filter((tour) =>
  //     tour.tourGuides.some((filterItem) => tourGuideIds.includes(filterItem.id))
  //   );
  // }

  // if (services.length) {
  //   inputData = inputData.filter((tour) => tour.services.some((item) => services.includes(item)));
  // }

  // if (!dateError) {
  //   if (startDate && endDate) {
  //     inputData = inputData.filter((tour) =>
  //       isBetween(startDate, tour.available.startDate, tour.available.endDate)
  //     );
  //   }
  // }

  // if (publish !== 'all') {
  //   inputData = inputData.filter((post) => post.publish === publish);
  // }

  return inputData;
};
// import React from 'react';
// import CalenderSchedule from './render-res-calender';

// export default function TourListView() {
//   return (
//     <div>
//       <CalenderSchedule />
//     </div>
//   );
// }
