import { Helmet } from 'react-helmet-async';

import { UserCreateView } from 'src/sections/inventory/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Request for Inventory</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
