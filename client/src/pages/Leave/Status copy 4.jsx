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
import { Link } from 'react-router-dom';


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
    const storedUserData = sessionStorage.getItem('user');
    if (storedUserData) {
      const userDetails = JSON.parse(storedUserData);
      setUserData(userDetails);
      setIsAdminMode(userDetails.role_lpm === "Admin");
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

  const userRequests = userData && userData.role_lpm === "Employee" ? leavestatusData.filter(request => request.user_id === userData.user_id) : leavestatusData;

  const filteredRequests = userData?.role_lpm === 'Employee'
    ? leavestatusData.filter((request) =>
      request.user_id === userData.user_id && request.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : leavestatusData.filter((request) =>
      request.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const leaveTypeMap = {
      1: 'EL', 2: 'SL', 3: 'CL', 4: 'CO', 5: 'SO', 6: 'SML', 7: 'ML', 8: 'CW', 
      9: 'OOD', 10: 'COL', 11: 'WFH', 12: 'WO', 13: 'MP', 14: 'PL'
    };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative flex items-center mb-10">
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link to="#" className="text-primary hover:underline">
              Leave
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Status</span>
          </li>
          <li>
          {userData ? (
        <div className="text-sm text-gray-700 mb-4"> 
          {/* <p className="inline-block px-2 py-1 m-2 rounded-md">User: "{userData.name}"</p>
          <p className="inline-block px-2 py-1 m-2 rounded-md">User ID: {userData.userid}</p> */}
          <span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
        User: {userData.name}, {userData.role_lpm}
      </span>
        </div>
      ) : 
      <span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
        {"Sample User, Admin"}
      </span>
      }
          </li>
        </ul>
        <h2 className="absolute inset-x-0 text-xl font-bold text-center">Leave Status</h2>
      </div>
      <div className="mb-4 flex justify-between items-center space-x-4">
        <div className="flex space-x-4">
          {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
            <button
              key={status}
              className={`px-4 py-0.5 rounded-md ${activeTab === status ? `bg-${status === 'Approved' ? 'green' : status === 'Pending' ? 'blue' : 'red'}-500 text-white` : 'bg-gray-200'}`}
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
            // style={{ width: '100%' }} // Add this line
            // className="w-full" // Tailwind CSS


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
                            // console.log('Approved by:', userData.name || 'N/A');

                            dispatch(updateLeaveStatus({
                              requestId: record.id,
                              newStatus: 'Approved',
                              approved_by_name: userData.name || 'N/A',
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
                                // rejectReason: reason,
                                remarks_1: reason,
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
              { accessor: 'user_name', sortable: true, title: 'User Name'},
              // { accessor: 'user_id', title: 'User ID' , sortable: true},
              // { accessor: 'leave_type', title: 'Leave Type', sortable: true },
              { accessor: 'reason', title: 'Leave Reason' , sortable: true},

              { accessor: 'leave_type', title: 'Leave Type (id)', sortable: true,
                render: (record) => 
                  <span>{leaveTypeMap[record.leave_type] ? `${leaveTypeMap[record.leave_type]} (${record.leave_type})` : `N/A (${record.leave_type})`}</span>
              },
              {
                accessor: 'from_date', title: 'Start Date', sortable: true,
                render: (record) => (
                  <span>{record.from_date ? new Date(record.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-') : 'N/A'}</span>
                ),
              },
              {
                accessor: 'to_date', title: 'End Date', sortable: true,
                render: (record) => (
                  <span>{record.to_date ? new Date(record.to_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-') : 'N/A'}</span>
                ),
              },
              {
                accessor: 'requested_date', title: 'Req Date', sortable: true,
                render: (record) => (
                  <span>{record.requested_date ? new Date(record.requested_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-') : 'N/A'}</span>
                ),
              },
              {
                accessor: 'status', title: 'Status', sortable: true,
                render: (record) => {
                  const statusClass =
                    record.status === 'Pending' ? 'bg-yellow-300' : record.status === 'Approved' ? 'bg-green-300' : record.status === 'Rejected' ? 'bg-red-300' : 'bg-gray-200'; // Default to gray if status is unknown
                  return (
                    <span className={`inline-block px-2 py-0.15 rounded-md ${statusClass}`}> {record.status}</span>
                  )
                },
              },
              // { accessor: 'reason', title: 'Leave Reason' , sortable: true},
              { accessor: 'approved_by', title: 'Approved By', sortable: true },
              { accessor: 'approved_date', title: 'Approved Date', sortable: true,
                render: (record) => (
                  <span>{record.approved_date ? new Date(record.approved_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' ', '-') : 'N/A'}</span>
                ),
               },
               { accessor: 'remarks', title: 'Remarks', sortable: true },




            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default LeaveStatus;