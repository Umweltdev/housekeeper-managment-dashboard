import { Helmet } from 'react-helmet-async';

import { MaintenanceView } from 'src/sections/maintenance/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintenance List</title>
      </Helmet>

      <MaintenanceView />
    </>
  );
}
