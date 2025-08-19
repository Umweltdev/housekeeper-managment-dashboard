import sumBy from 'lodash/sumBy';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { isAfter, isBetween } from 'src/utils/format-time';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useDeleteTask, useGetTasks } from 'src/api/task';
import InvoiceTableToolbar from './invoice-table-toolbar';
import CleaningTaskTableRow from './cleaning-task-edit-row';
import InvoiceTableFiltersResult from './invoice-table-filters-result';

const TABLE_HEAD = [
  { id: 'room', label: 'Room' },
  { id: 'category', label: 'Room Type' },
  { id: 'description', label: 'Description' },
  { id: 'assignedTo', label: 'Housekeeper' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'priority', label: 'Priority' },
  { id: 'status', label: 'Cleaning Status' },
  { id: '', label: '' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// Transformation function for table display
const mapRealTimeTasks = (tasks) =>
  tasks.map((task) => ({
    id: task._id,
    room: task.roomId?.roomNumber?.toString() || task.roomId?.toString() || 'Unknown',
    category: task.roomId?.roomType?.title || 'Unknown',
    description: task.status?.description || 'No description',
    assignedTo: task.housekeeperId?.name || task.housekeeperId?.toString() || null,
    dueDate: task.dueDate || null,
    priority: task.priority
      ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
      : 'Medium',
    status: task.status?.statusType || 'dirty',
    createDate: task.createdAt || null,
    items: [
      ...(task.status?.detailedIssues || []).map((issue) => ({ service: issue.issue })),
      ...(task.status?.maintenanceAndDamages || []).map((issue) => ({ service: issue.issue })),
    ],
  }));

// Transform task for edit form to match CleaningTaskEditForm PropTypes
const transformTaskForEdit = (task) => ({
  id: task._id || '',
  room: task.roomId?.roomNumber?.toString() || task.roomId?.toString() || 'Unknown',
  category: task.roomId?.roomType?.title || 'Unknown',
  description: task.status?.description || '',
  dueDate: task.dueDate || '',
  assignedTo: task.housekeeperId?.name || task.housekeeperId?.toString() || '',
  priority: task.priority
    ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    : 'Medium',
  status: task.status?.statusType || 'dirty',
  maintenanceAndDamages: task.status?.maintenanceAndDamages || [],
  roomId: task.roomId || { roomNumber: task.roomId?.toString() || 'Unknown' },
  detailedIssues: task.status?.detailedIssues || [],
});

export default function InvoiceListViewEdit() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { tasks, refetch } = useGetTasks();
  const { deleteTask } = useDeleteTask();
  // console.log('TASKS', tasks);

  const settings = useSettingsContext();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();
  const [tableData, setTableData] = useState([]);
  const [rawTasks, setRawTasks] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  // Memoize roomCategories and assignees to stabilize their references
  const roomCategories = useMemo(
    () =>
      tasks?.success
        ? Array.from(
            new Set(
              tasks.data.map((task) => task.roomId?.roomType?.title || 'Unknown').filter(Boolean)
            )
          )
        : ['Standard', 'Deluxe', 'Suite'],
    [tasks]
  );

  const assignees = useMemo(
    () =>
      tasks?.success
        ? Array.from(
            new Set(
              tasks.data
                .map((task) => task.housekeeperId?.name || task.housekeeperId?.toString() || 'None')
                .filter(Boolean)
            )
          )
        : ['John Doe', 'Jane Smith', 'Alex Brown'],
    [tasks]
  );

  // Transform real-time tasks when data is available
  useEffect(() => {
    if (tasks?.success && tasks?.data) {
      console.log('RAW_TASKS', tasks.data);
      setRawTasks(tasks.data);
      const transformedTasks = mapRealTimeTasks(tasks.data);
      console.log('TRANSFORMED', transformedTasks);
      const sortedTasks = [...transformedTasks].sort(
        (a, b) => new Date(b.createDate || 0) - new Date(a.createDate || 0)
      );
      setTableData(sortedTasks);
    } else {
      setTableData([]);
      setRawTasks([]);
    }
  }, [tasks]);

  // Define TABS before JSX
  const TABS = [
    { value: 'all', label: 'All Tasks', color: 'default', count: tableData.length },
    {
      value: 'cleaned',
      label: 'Cleaned',
      color: 'success',
      count: tableData.filter((item) => item.status === 'cleaned').length,
    },
    {
      value: 'inspected',
      label: 'Inspected',
      color: 'info',
      count: tableData.filter((item) => item.status === 'inspected').length,
    },
    {
      value: 'dirty',
      label: 'Dirty',
      color: 'error',
      count: tableData.filter((item) => item.status === 'dirty').length,
    },
  ];

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters?.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({ ...prevState, [name]: value }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => setFilters(defaultFilters), []);

  const handleDeleteRow = useCallback(
    async (id) => {
      const result = await deleteTask(id);
      if (result.success) {
        confirm.onFalse();
      }
    },
    [deleteTask, confirm]
  );

  const handleEditRow = useCallback(
    (id) => {
      const rawTask = rawTasks.find((task) => task._id === id);
      if (rawTask) {
        const transformedTask = transformTaskForEdit(rawTask);
        router.push({
          pathname: paths.dashboard.task.edit(id),
          state: { task: transformedTask, roomCategories, assignees },
        });
      } else {
        enqueueSnackbar('Task not found', { variant: 'error' });
      }
    },
    [router, rawTasks, enqueueSnackbar, roomCategories, assignees]
  );

  const handleMoveToInspected = useCallback(
    (id, newStatus) =>
      setTableData((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
      ),
    []
  );

  const handleViewRow = useCallback(
    (id) => router.push(paths.dashboard.invoice.details(id)),
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => handleFilters('status', newValue),
    [handleFilters]
  );

  return (
    <>
      {(!tasks || tasks?.loading) && <div>Loading...</div>}
      {tasks && !tasks.success && <div>Error loading tasks: {tasks.error}</div>}
      {tasks?.success && (
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dateError={dateError}
            serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option?.name)}
          />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <CleaningTaskTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onMoveToInspected={handleMoveToInspected}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      )}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// applyFilter function remains unchanged
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (task) =>
        task?.room.toLowerCase().includes(name.toLowerCase()) ||
        task?.assignedTo?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    if (status === 'high') {
      inputData = inputData.filter((task) => task.priority === 'High');
    } else {
      inputData = inputData.filter((task) => task.status === status);
    }
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items?.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((task) => isBetween(task.createDate, startDate, endDate));
  }

  return inputData;
}
