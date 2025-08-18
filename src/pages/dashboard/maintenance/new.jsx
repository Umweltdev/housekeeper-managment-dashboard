import { Helmet } from 'react-helmet-async';

import { UserCreateView } from 'src/sections/maintenance/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Request for Maintenance</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
