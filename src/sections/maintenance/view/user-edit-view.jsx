/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import { useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetUser } from 'src/api/user';
import { CLEANING_TASKS } from './maintenance-tasks';

import CleaningTaskEditForm from './cleaning-task-edit-view';
// import { get } from 'lodash';

// ----------------------------------------------------------------------

export default function TaskEditView({ id }) {
  const settings = useSettingsContext();
  const { user } = useGetUser(id);

  const maintenance = CLEANING_TASKS.find((t) => t.id.toString() === id);

  // const getUserDetails = async (userId) => {
  //   try {
  //     const response = await axiosInstance.get(`/api/user/${userId}`);
  //     setCurrentUser(response.data);
  //     // console.info('DATA', response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Maintenance Update"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Maintenance List',
            href: paths.dashboard.maintenance.root,
          },
          { name: 'Maintenance Update' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <CleaningTaskEditForm maintenance={maintenance} />
    </Container>
  );
}

TaskEditView.propTypes = {
  id: PropTypes.string,
};
