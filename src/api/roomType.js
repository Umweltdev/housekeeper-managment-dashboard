import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetRoomTypes() {
  const URL = endpoints.roomType.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  // console.log(data)
  const refreshRoomsTypes = useCallback(() => {
    mutate(URL);
  }, [URL]);
  const memoizedValue = useMemo(
    () => ({
      roomTypes: data || [],
      roomTypesLoading: isLoading,
      roomTypesError: error,
      roomTypesValidating: isValidating,
      roomTypesEmpty: !isLoading && !data?.length,
      refreshRoomsTypes,
    }),
    [data, error, isLoading, isValidating, refreshRoomsTypes]
  );

  return memoizedValue;
}


// ----------------------------------------------------------------------

export function useRoomType(id) {
  const URL = id ? `${endpoints.roomType.list}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      roomType: data,
      roomTypeLoading: isLoading,
      roomTypeError: error,
      roomTypeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchRoomTypes(query) {
  const URL = query ? [endpoints.roomType.list, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
