import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { UserEditView } from 'src/sections/maintenance/view';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Maintenance Update</title>
      </Helmet>

      <UserEditView id={`${id}`} />
    </>
  );
}
