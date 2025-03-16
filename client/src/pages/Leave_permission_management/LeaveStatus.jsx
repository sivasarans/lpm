import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

function LeaveStatus() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch leave requests and user data
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      // Simulate an API call to fetch leave requests (replace with your actual API call)
      const response = await fetch('http://localhost:5000/api/leave-requests');
      const data = await response.json();
      setLeaveRequests(data);
    };

    fetchLeaveRequests();

    // Fetch user data from localStorage
    const storedUserData = localStorage.getItem('userDetails');
    if (storedUserData) {
      const userDetails = JSON.parse(storedUserData);
      setUserData(userDetails);
      setIsAdminMode(userDetails.role === "Admin");
    }
  }, []);

  const filterRequests = (status) => {
    if (status === 'All') return leaveRequests;
    return leaveRequests.filter((request) => request.status === status);
  };

  const approveLeave = async (requestId) => {
    // Simulate an API call to approve leave
    const updatedRequests = leaveRequests.map((request) =>
      request.id === requestId ? { ...request, status: 'Approved' } : request
    );
    setLeaveRequests(updatedRequests);
  };

  const rejectLeave = async (requestId, reason) => {
    // Simulate an API call to reject leave
    const updatedRequests = leaveRequests.map((request) =>
      request.id === requestId ? { ...request, status: 'Rejected', reject_reason: reason } : request
    );
    setLeaveRequests(updatedRequests);
  };

  const deleteLeave = async (requestId) => {
    // Simulate an API call to delete leave request
    const updatedRequests = leaveRequests.filter((request) => request.id !== requestId);
    setLeaveRequests(updatedRequests);
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      width: 150,
      renderCell: (params) => (
        <>
          {isAdminMode && params.row.status === 'Pending' ? (
            <>
              <IconButton onClick={() => approveLeave(params.row.id)} color="primary" aria-label="approve">
                <CheckIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  const reason = window.prompt('Enter the reason for rejecting this leave request:');
                  if (reason) rejectLeave(params.row.id, reason);
                  else alert('Rejection reason is required!');
                }}
                color="secondary"
                aria-label="reject"
              >
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            !isAdminMode && params.row.status === 'Pending' && (
              <IconButton onClick={() => deleteLeave(params.row.id)} color="default">
                <DeleteIcon />
              </IconButton>
            )
          )}
        </>
      ),
    },
    { field: 'user_name', headerName: 'User Name', flex: 1 },
    { field: 'user_id', headerName: 'User ID', flex: 1 },
    { field: 'leave_type', headerName: 'Leave Type', flex: 1 },
    {
      field: 'from_date',
      headerName: 'Start Date',
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.row?.from_date
            ? new Date(params.row.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-')
            : 'N/A'}
        </span>
      ),
    },
    {
      field: 'to_date',
      headerName: 'End Date',
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.row?.to_date
            ? new Date(params.row.to_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-')
            : 'N/A'}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const statusClass =
          params.row.status === 'Pending'
            ? 'bg-yellow-300'
            : params.row.status === 'Approved'
            ? 'bg-green-300'
            : params.row.status === 'Rejected'
            ? 'bg-red-300'
            : 'bg-gray-200';
        return <span className={`inline-block px-2 py-0.15 rounded-md ${statusClass}`}>{params.row.status}</span>;
      },
    },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'reject_reason', headerName: 'Reject Reason', flex: 1 },
    {
      field: 'profile_picture',
      headerName: 'Profile',
      width: 100,
      renderCell: (params) => <img src={`http://localhost:5000${params.row.profile_picture}`} alt="Profile" className="w-12 h-12 rounded-full object-cover" />,
    },
  ];

  const userRequests =
    userData && userData.role === 'Employee' ? leaveRequests.filter((request) => request.user_id === userData.user_id) : leaveRequests;

  const filteredRequests = userData?.role === 'Employee'
    ? leaveRequests.filter((request) => request.user_id === userData.user_id && request.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : leaveRequests.filter((request) => request.user_name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <NavLink to="/leaveform" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">Apply Leave</span>
      </NavLink>

      {userData ? (
        <div className="text-sm text-gray-700 mb-4">
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">User: "{userData.name}"</p>
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">User ID: {userData.user_id}</p>
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">Role: {userData.role}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <div className="mb-4 flex justify-between items-center space-x-4">
        <div className="flex space-x-4">
          {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
            <button
              key={status}
              className={`px-4 py-0.5 rounded-md ${activeTab === status ? `bg-${status === 'Approved' ? 'green' : status === 'Pending' ? 'yellow' : 'red'}-500 text-white` : 'bg-gray-200'}`}
              onClick={() => setActiveTab(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {userData && userData.role === 'Admin' && selectedRows.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Button variant="contained" color="primary" onClick={ApproveAllSelected}>
            Approve All
          </Button>
          <Button variant="contained" color="secondary" onClick={RejectAllSelected}>
            Reject All
          </Button>
        </div>
      )}

      <div style={{ height: 400, width: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <DataGrid
          rows={filteredRequests.filter((request) => filterRequests(activeTab).includes(request))}
          columns={columns}
          checkboxSelection
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          onRowSelectionModelChange={(xxx) => {
            console.log('Selection model changed:', xxx);
            setSelectedRows(xxx);
          }}
          style={{ minWidth: 1000 }}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              position: 'sticky',
              top: 0,
              backgroundColor: 'rgba(185, 230, 80, 1)',
            },
            '& .MuiDataGrid-footerContainer': {
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'rgba(122, 143, 140, 0.18)',
              zIndex: 2,
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'rgba(208, 220, 223, 0.37)',
            },
          }}
        />
      </div>
    </div>
  );
}

export default LeaveStatus;
