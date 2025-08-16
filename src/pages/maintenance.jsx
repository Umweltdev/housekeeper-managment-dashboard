import { Helmet } from 'react-helmet-async';

import { MaintenanceFallback } from 'src/sections/maintenance/view';

// ----------------------------------------------------------------------

export default function MaintenancePage() {
  return (
    <>
      <Helmet>
        <title> Maintenane</title>
      </Helmet>

      <MaintenanceFallback />
    </>
  );
}
