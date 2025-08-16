import { Helmet } from 'react-helmet-async';

import { InventoryListView } from 'src/sections/maintenance/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintenance List</title>
      </Helmet>

      <InventoryListView />
    </>
  );
}
