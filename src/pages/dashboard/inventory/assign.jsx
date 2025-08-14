import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import RequestInventoryAssign from 'src/sections/inventory/view/request-inventory-assign';

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: New Inventory</title>
      </Helmet>

      <RequestInventoryAssign  />
    </>
  );
}
