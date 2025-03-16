import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaveRequests, deleteLeaveRequests, updateLeaveStatus } from "../../store/reducers/leavestatus";
import { DataTable } from 'mantine-datatable';

function LeaveStatus() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const dispatch = useDispatch();
  const { leavestatusData } = useSelector((state) => state.leavestatus);
  const deleteLeave = (requestId) => { dispatch(deleteLeaveRequests(requestId)); };

  useEffect(() => { dispatch(fetchLeaveRequests()); }, [dispatch]);

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userDetails');
    if (storedUserData) {
      const userDetails = JSON.parse(storedUserData);
      setUserData(userDetails);
      setIsAdminMode(userDetails.role === "Admin");
    }
  }, []);

  const filterRequests = (status) => {
    if (status === 'All') return leavestatusData;
    return leavestatusData.filter((request) => request.status === status);
  };

  const ApproveAllSelected = async () => {
    await selectedRows.forEach((id) => {
      const selectedRow = leavestatusData.find((row) => row.id === id);
      if (selectedRow) {
        dispatch(updateLeaveStatus({
          requestId: id,
          newStatus: 'Approved',
          leave_days: selectedRow.leave_days, // Extra field
          leave_type: selectedRow.leave_type,
          user_id: selectedRow.user_id, // Extra field
        }));
      }
    });
  };

  const RejectAllSelected = async () => {
    const reason = window.prompt('Enter the reason for rejecting these leave requests:');
    if (reason) {
      await selectedRows.forEach((id) => {
        const selectedRow = leavestatusData.find((row) => row.id === id);
        if (selectedRow) {
          dispatch(updateLeaveStatus({
            requestId: id,
            newStatus: 'Rejected',
            rejectReason: reason,
            leave_days: selectedRow.leave_days,
            leave_type: selectedRow.leave_type,
            user_id: selectedRow.user_id,
          }));
        }
      });
    } else {
      alert('Rejection reason is required!');
    }
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      width: 150, // Increase the width
      renderCell: (params) => (
        <>
          {isAdminMode && params.row.status === 'Pending' ? (
            <>
              <IconButton
                onClick={() => {
                  dispatch(updateLeaveStatus({
                    requestId: params.row.id,
                    newStatus: 'Approved',
                    leave_days: params.row.leave_days, // Extra field
                    leave_type: params.row.leave_type, // Extra field
                    user_id: params.row.user_id, // Extra field
                  }));
                }}
                color="primary"
                aria-label="approve"
              >
                <CheckIcon />
              </IconButton>
              {/* Approval Icon */}
              <IconButton
                onClick={() => {
                  const reason = window.prompt('Enter the reason for rejecting this leave request:');
                  if (reason) {
                    dispatch(updateLeaveStatus({
                      requestId: params.row.id,
                      newStatus: 'Rejected',
                      rejectReason: reason,
                      leave_days: params.row.leave_days, // Extra field
                      leave_type: params.row.leave_type, // Extra field
                      user_id: params.row.user_id, // Extra field
                    }));
                  } else {
                    alert('Rejection reason is required!');
                  }
                }}
                color="secondary"
                aria-label="reject"
              >
                <CloseIcon />
              </IconButton>
              {/* Rejection Icon */}
            </>
          ) : (
            !isAdminMode && params.row.status === 'Pending' && (
              <IconButton
                onClick={() => deleteLeave(params.row.id)}
                color="default">
                <DeleteIcon />
              </IconButton>
            ))}
        </>
      ),
    },
    { field: 'user_name', headerName: 'User Name', flex: 1 },
    { field: 'user_id', headerName: 'User ID', flex: 1 },
    { field: 'leave_type', headerName: 'Leave Type', flex: 1 },
    {
      field: 'from_date', headerName: 'Start Date', flex: 1,
      renderCell: (params) => {
        const date = params.row?.from_date;
        return (<span>{params.row?.from_date ? new Date(params.row.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-') : 'N/A'}</span>);
      },
    },
    {
      field: 'to_date', headerName: 'End Date', flex: 1,
      renderCell: (params) => {
        const date = params.row?.to_date;
        return (<span>{params.row?.to_date ? new Date(params.row.to_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-') : 'N/A'}</span>);
      },
    },
    {
      field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => {
        const statusClass =
          params.row.status === 'Pending' ? 'bg-yellow-300' : params.row.status === 'Approved' ? 'bg-green-300' : params.row.status === 'Rejected' ? 'bg-red-300' : 'bg-gray-200'; // Default to gray if status is unknown
        return (
          <span className={`inline-block px-2 py-0.15 rounded-md ${statusClass}`}> {params.row.status}</span>
        )
      },
    },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'reject_reason', headerName: 'Reject Reason', flex: 1 },
    {
      field: 'profile_picture',
      headerName: 'Profile',
      width: 100,
      renderCell: (params) => (
        <img
          src={`http://localhost:3500${params.row.profile_picture}`}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      ),
    },
  ];

  const userRequests = userData && userData.role === "Employee" ? leavestatusData.filter(request => request.user_id === userData.user_id) : leavestatusData;

  const filteredRequests = userData?.role === 'Employee'
    ? leavestatusData.filter((request) =>
      request.user_id === userData.user_id && request.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : leavestatusData.filter((request) =>
      request.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <NavLink
        to="/leaveform"
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Apply Leave
        </span>
      </NavLink>

      {/* User Info */}
      {userData ? (
        <div className="text-sm text-gray-700 mb-4">
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">User: "{userData.name}"</p>
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">User ID: {userData.user_id}</p>
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">Role: {userData.role}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      {/* Tab Buttons and Search Box in Same Line */}
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
      {userData && userData.role === "Admin" && selectedRows.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Button variant="contained" color="primary" onClick={ApproveAllSelected}>Approve All</Button>
          <Button variant="contained" color="secondary" onClick={RejectAllSelected}>Reject All</Button>
        </div>
      )}
      <div style={{ height: 400, width: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <div className="datatables pagination-padding">
          <DataTable
            className="whitespace-nowrap table-hover"
            withColumnBorders
            borderColor="#d0d4da"
            rowBorderColor="#d0d4da"
            records={filteredRequests}
            columns={[
              {
                accessor: 'actions',
                title: 'Actions',
                sortable: false,
                render: (record) => (
                  <>
                    {isAdminMode && record.status === 'Pending' ? (
                      <>
                        <IconButton
                          onClick={() => {
                            dispatch(updateLeaveStatus({
                              requestId: record.id,
                              newStatus: 'Approved',
                              leave_days: record.leave_days, // Extra field
                              leave_type: record.leave_type, // Extra field
                              user_id: record.user_id, // Extra field
                            }));
                          }}
                          color="primary"
                          aria-label="approve"
                        >
                          <CheckIcon />
                        </IconButton>
                        {/* Approval Icon */}
                        <IconButton
                          onClick={() => {
                            const reason = window.prompt('Enter the reason for rejecting this leave request:');
                            if (reason) {
                              dispatch(updateLeaveStatus({
                                requestId: record.id,
                                newStatus: 'Rejected',
                                rejectReason: reason,
                                leave_days: record.leave_days, // Extra field
                                leave_type: record.leave_type, // Extra field
                                user_id: record.user_id, // Extra field
                              }));
                            } else {
                              alert('Rejection reason is required!');
                            }
                          }}
                          color="secondary"
                          aria-label="reject"
                        >
                          <CloseIcon />
                        </IconButton>
                        {/* Rejection Icon */}
                      </>
                    ) : (
                      !isAdminMode && record.status === 'Pending' && (
                        <IconButton
                          onClick={() => deleteLeave(record.id)}
                          color="default">
                          <DeleteIcon />
                        </IconButton>
                      ))}
                  </>
                ),
              },
              { accessor: 'user_name', title: 'User Name' },
              { accessor: 'user_id', title: 'User ID' },
              { accessor: 'leave_type', title: 'Leave Type' },
              {
                accessor: 'from_date', title: 'Start Date',
                render: (record) => (
                  <span>{record.from_date ? new Date(record.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-') : 'N/A'}</span>
                ),
              },
              {
                accessor: 'to_date', title: 'End Date',
                render: (record) => (
                  <span>{record.to_date ? new Date(record.to_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-') : 'N/A'}</span>
                ),
              },
              {
                accessor: 'status', title: 'Status',
                render: (record) => {
                  const statusClass =
                    record.status === 'Pending' ? 'bg-yellow-300' : record.status === 'Approved' ? 'bg-green-300' : record.status === 'Rejected' ? 'bg-red-300' : 'bg-gray-200'; // Default to gray if status is unknown
                  return (
                    <span className={`inline-block px-2 py-0.15 rounded-md ${statusClass}`}> {record.status}</span>
                  )
                },
              },
              { accessor: 'reason', title: 'Reason' },
              { accessor: 'reject_reason', title: 'Reject Reason' },
              {
                accessor: 'profile_picture', title: 'Profile',
                render: (record) => (
                  <img
                    src={`http://localhost:3500${record.profile_picture}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ),
              },
            ]}
          />
        </div>

        <DataGrid
          rows={filteredRequests.filter((request) => filterRequests(activeTab).includes(request))}
          columns={columns}
          checkboxSelection
          slots={{ toolbar: GridToolbar }} // Adds the toolbar with the quick filter
          slotProps={{
            toolbar: {
              showQuickFilter: true, // Enables the search input
              quickFilterProps: { debounceMs: 500 }, // Adds a debounce for better performance
            },
          }}
          onRowSelectionModelChange={(xxx) => {
            console.log("Selection model changed:", xxx);
            setSelectedRows(xxx);
          }}
          style={{ minWidth: 1000, }}// Sets a minimum width to allow horizontal scrolling
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              position: 'sticky',
              top: 0,
              backgroundColor: 'rgba(185, 230, 80, 1)', // Header background color
            },
            '& .MuiDataGrid-footerContainer': {
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'rgba(122, 143, 140, 0.18)', // Footer background color
              zIndex: 2,
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'rgba(208, 220, 223, 0.37)', // Light grey for even rows
            },
          }}
        />
      </div>
    </div>
  );
}

export default LeaveStatus;