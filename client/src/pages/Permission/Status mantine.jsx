import React, { useState, useEffect } from 'react';
import { DataTable } from 'mantine-datatable';
import { Button, Group, Textarea, Modal, Select, Checkbox, Menu } from '@mantine/core';

const PermissionStatus = () => {
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [columns, setColumns] = useState([
    { accessor: 'actions', title: 'Actions', visible: true },
    { accessor: 'user_id', title: 'User ID', visible: true },
    { accessor: 'username', title: 'Username', visible: true },
    { accessor: 'date', title: 'Date', visible: true },
    { accessor: 'total_hours', title: 'Total Hours', visible: true },
    { accessor: 'reason', title: 'Reason', visible: true },
    { accessor: 'status', title: 'Status', visible: true },
  ]);
  const [density, setDensity] = useState('comfortable');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userDetails');
    if (storedUserData) {
      const userDetails = JSON.parse(storedUserData);
      setUserData(userDetails);

      // Mock API fetch
      const fetchedPermissions = [
        // Add mock data here
        { id: 1, user_id: 101, username: 'John Doe', date: '2025-01-20', total_hours: 8, reason: 'Meeting', status: 'Pending' },
        // Add more rows
      ];
      setPermissionRequests(fetchedPermissions);

      if (userDetails.role === 'Admin') {
        setFilteredRequests(fetchedPermissions);
      } else {
        setFilteredRequests(fetchedPermissions.filter((req) => req.user_id === userDetails.user_id));
      }
    }
  }, []);

  const handleApprove = (id) => {
    console.log(`Permission approved for ID: ${id}`);
  };

  const handleReject = (id) => {
    setSelectedRequest(id);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    console.log(`Permission rejected for ID: ${selectedRequest} with reason: ${rejectReason}`);
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const handleColumnToggle = (accessor) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.accessor === accessor ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return (
    <div className="panel px-0 border-white-light">
      <div className="invoice-table">
        <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
          <Button onClick={() => setShowPermissionForm(!showPermissionForm)}>
            {showPermissionForm ? 'Close Permission Form' : 'Open Permission Form'}
          </Button>

          <div className="ltr:ml-auto rtl:mr-auto flex items-center gap-4">
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
            columns={columns.filter((col) => col.visible).map((col) => ({
              ...col,
              render: col.accessor === 'actions' ? (row) => (
                row.status === 'Pending' && (
                  <Group spacing="xs">
                    <Button color="green" onClick={() => handleApprove(row.id)}>Approve</Button>
                    <Button color="red" onClick={() => handleReject(row.id)}>Reject</Button>
                  </Group>
                )
              ) : undefined,
            }))}
            highlightOnHover
          />
        </div>
      </div>

      <Modal
        opened={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Reason"
      >
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

export default PermissionStatus;
