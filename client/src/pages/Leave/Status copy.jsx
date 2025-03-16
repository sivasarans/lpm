import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import { Button, Group, Textarea, Modal, Menu, Checkbox, Select } from '@mantine/core';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
// import dayjs from 'dayjs';

const LeaveStatus = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [columns, setColumns] = useState([
    { accessor: 'actions', title: 'Actions', visible: true },
    { accessor: 'user_id', title: 'User ID', visible: true },
    { accessor: 'user_name', title: 'User Name', visible: true },
    { accessor: 'leave_type', title: 'Leave Type', visible: true },
    { accessor: 'from_date', title: 'Start Date', visible: true },
    { accessor: 'to_date', title: 'End Date', visible: true },
    { accessor: 'reason', title: 'Reason', visible: true },
    { accessor: 'reject_reason', title: 'Reject Reason', visible: true },
    { accessor: 'status', title: 'Status', visible: true },
  ]);
  const [density, setDensity] = useState('comfortable');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userDetails');
    if (storedUserData) {
      const userDetails = JSON.parse(storedUserData);
      setUserData(userDetails);
      setIsAdminMode(userDetails.role === 'Admin');
    }
  }, []);

  const filteredRequests = leaveRequests.filter((request) =>
    request.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id) => {
    console.log(`Leave approved for ID: ${id}`);
  };

  const handleReject = (id) => {
    setSelectedRows([id]);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    selectedRows.forEach((id) => {
      console.log(`Leave rejected for ID: ${id} with reason: ${rejectReason}`);
    });
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const handleExport = () => {
    const dataToExport = filteredRequests.map((row) => ({
      user_id: row.user_id,
      user_name: row.user_name,
      leave_type: row.leave_type,
      from_date: row.from_date,
      to_date: row.to_date,
      reason: row.reason,
      reject_reason: row.reject_reason,
      status: row.status,
    }));
    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'leave_requests.csv';
    link.click();
  };

  const handleColumnToggle = (accessor) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.accessor === accessor ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return (
    <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
      <div className="invoice-table">
        <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
          <div className="flex items-center gap-2">
            <NavLink to="/leave/apply" className="btn btn-primary gap-2">
              Apply Leave
            </NavLink>
          </div>
          <div className="ltr:ml-auto rtl:mr-auto flex items-center gap-4">
            <input
              type="text"
              className="form-input w-auto"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline" onClick={handleExport}>
              Export CSV
            </Button>
            <Select
              value={density}
              onChange={setDensity}
              data={[
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'compact', label: 'Compact' },
                { value: 'spacious', label: 'Spacious' },
              ]}
              placeholder="Density"
            />
            <Menu>
              <Menu.Target>
                <Button variant="outline">Columns</Button>
              </Menu.Target>
              <Menu.Dropdown>
                {columns.map((col) => (
                  <Menu.Item key={col.accessor}>
                    <Checkbox
                      checked={col.visible}
                      onChange={() => handleColumnToggle(col.accessor)}
                      label={col.title}
                    />
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>

        <div className="datatables pagination-padding">
          <DataTable
            className={`whitespace-nowrap table-hover ${density}`}
            withColumnBorders
            borderColor="#d0d4da"
            rowBorderColor="#d0d4da"
            records={filteredRequests}
            columns={columns.filter((col) => col.visible)}
            highlightOnHover
            totalRecords={filteredRequests.length}
            page={1}
            recordsPerPage={10}
            onPageChange={() => {}}
            sortBy={{ user_name: 'asc' }}
            onSortChange={() => {}}
            paginationText={({ from, to, totalRecords }) =>
              `Showing ${from} to ${to} of ${totalRecords} entries`
            }
            draggable
            onColumnDragEnd={(fromIndex, toIndex) => {
              const reorderedColumns = [...columns];
              const [draggedColumn] = reorderedColumns.splice(fromIndex, 1);
              reorderedColumns.splice(toIndex, 0, draggedColumn);
              setColumns(reorderedColumns);
            }}
            actionsColumn={{
              accessor: 'actions',
              title: 'Actions',
              render: (row) => (
                <Group gap={4}>
                  <Button
                    variant="subtle"
                    color="green"
                    onClick={() => handleApprove(row.user_id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={() => handleReject(row.user_id)}
                  >
                    Reject
                  </Button>
                </Group>
              ),
            }}
          />
        </div>
      </div>

      <Modal opened={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Reason">
        <Textarea
          label="Enter reason"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
        <Group position="right" mt="md">
          <Button onClick={handleRejectConfirm}>Reject</Button>
        </Group>
      </Modal>
    </div>
  );
};

export default LeaveStatus;
