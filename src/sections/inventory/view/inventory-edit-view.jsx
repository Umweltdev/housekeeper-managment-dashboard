/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetUser } from 'src/api/user';
import { INVENTORY_LIST } from './inventory-item';

import CleaningTaskEditForm from './cleaning-task-edit-view';
// import { get } from 'lodash';

// ----------------------------------------------------------------------

export default function TaskEditView({ id }) {
  const settings = useSettingsContext();
  const { user } = useGetUser(id);

  const inventory = INVENTORY_LIST.find((t) => t.id.toString() === id);

  // const getUserDetails = async (userId) => {
  //   try {
  //     const response = await axiosInstance.get(`/api/user/${userId}`);
  //     setCurrentUser(response.data);
  //     // console.info('DATA', response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getUserDetails(id);
  // }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Inventory Update"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Inventory List',
            href: paths.dashboard.inventory.root,
          },
          { name: 'Inventory Update' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <UserNewEditForm currentUser={booking} /> */}
      <CleaningTaskEditForm inventory={inventory} />
    </Container>
  );
}

TaskEditView.propTypes = {
  id: PropTypes.string,
};
