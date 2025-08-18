import { Helmet } from 'react-helmet-async';
import InventoryListView from 'src/sections/maintenance/view/inventory-list-view';


// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Inventory List</title>
      </Helmet>

      <InventoryListView />
    </>
  );
}
