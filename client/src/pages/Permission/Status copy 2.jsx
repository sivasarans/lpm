import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Cancel } from '@mui/icons-material';
import AddTaskSharpIcon from '@mui/icons-material/AddTaskSharp';
import { Link } from 'react-router-dom';


function PermissionStatus() {
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // Fetch user data on component mount
    // useEffect(() => {
    //   const storedUserData = sessionStorage.getItem('user');
    //   if (storedUserData) {
    //     const userDetails = JSON.parse(storedUserData);
    //     // setUserData(response.data);
    //     setUserError(null);
    //     setUserData(userDetails);
    //     // setIsAdminMode(userDetails.role_lpm === "Admin");
    //   }
    // }, []);

      useEffect(() => {
        const storedUserData = sessionStorage.getItem('user');
        if (storedUserData) {
          const userDetails = JSON.parse(storedUserData);
          setUserData(userDetails);
          setIsAdminMode(userDetails.role_lpm === "Admin");
        }
      }, []);

      // console.log("userData:1", userData);
  // Fetch permissions when user data is available
  useEffect(() => {
    if (!userData) return;

    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3700/permission');
        setPermissionRequests(response.data.result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [userData]);

  // Filter permissions based on user role
  useEffect(() => {
    if (!userData) {
      setFilteredRequests([]);
      return;
    }

    if (userData.role === 'Admin') {
      setFilteredRequests(permissionRequests);
    } else {
      const userSpecificData = permissionRequests.filter(
        (req) => req.user_id === userData.user_id
      );
      setFilteredRequests(userSpecificData);
    }
  }, [userData, permissionRequests]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3700/permission/update/${id}`, { status , 
        approved_by_name: userData.name || 'N/A',     
       });
      setPermissionRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status } : req))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { field: 'user_id', headerName: 'User ID', width: 150 },
    { field: 'username', headerName: 'Username', width: 150 },
    {
      field: 'date',
      headerName: 'Date',
      width: 250,
      renderCell: (params) => {
        const { date, in_time, out_time } = params.row || {};
        const formatTime24Hr = (time) => {
          const formattedTime = new Date(`1970-01-01T${time}`);
          return formattedTime.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        };

        return (
          <span className="px-4 py-2">
            {date ? new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) : 'N/A'}
            {in_time && out_time ? ` (${formatTime24Hr(in_time)} - ${formatTime24Hr(out_time)})` : ''}
          </span>
        );
      },
    },
    { field: 'total_hours', headerName: 'Total Hours', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      cellClassName: (params) => {
        switch (params.value) {
          case 'Approved': return 'bg-green-200';
          case 'Rejected': return 'bg-red-200';
          case 'Pending': return 'bg-yellow-200';
          default: return '';
        }
      },
    },
    // {
    //   field: 'approved_by',
    //   headerName: 'Approved By',
    //   width: 150,
    //   valueGetter: (params) => params.row?.approved_by || 'N/A',
    // },
    // {
    //   field: 'approved_datetime',
    //   headerName: 'Approved Time',
    //   width: 200,
    //   valueGetter: (params) =>
    //     params.row?.approved_datetime
    //       ? new Date(params.row.approved_datetime).toLocaleString('en-GB')
    //       : 'N/A',
    // },

      
    { field: 'reason', headerName: 'Reason', width: 250 },
    userData?.role === 'Admin' && {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        params.row.status === 'Pending' && (
          <>
            <AddTaskSharpIcon
              onClick={() => handleUpdateStatus(params.row.id, 'Approved')}
              style={{ color: 'green', cursor: 'pointer', marginRight: '16px' }}
            />
            <Cancel
              onClick={() => handleUpdateStatus(params.row.id, 'Rejected')}
              style={{ color: 'red', cursor: 'pointer' }}
            />
          </>
        )
      ),
    },
  ].filter(Boolean);

  return (
    <div 
    // style={{ height: 600, width: '100%' }} className="max-w-4xl mx-auto p-4"
    >
          <div className="relative flex items-center mb-10">
          <ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
              <Link to="#" className="text-primary hover:underline">
                Permission
              </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
              <span>Status</span>
            </li>
            <li>
            {userData ? (
          <div className="text-sm text-gray-700 mb-4">  {/* Increased mt-40 to mt-60 for more space */}
                    <span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
                    User: "{userData.name}", {userData.role_lpm}
                    </span>
          </div>
        ) : 
        <span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
          {"Sample User, Admin"}
        </span>
        }
            </li>
          </ul>
          <h2 className="absolute inset-x-0 text-xl font-bold text-center">Permission Status</h2>
        </div>

      {/* <button
        onClick={() => setShowPermissionForm(!showPermissionForm)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {showPermissionForm ? 'Close Permission Form' : 'Open Permission Form'}
      </button>
      {showPermissionForm && <Permission />} */}
      <div style={{ height: 600, width: '100%' }} className="max-w-auto ml-auto mr-auto ">
      <DataGrid
        rows={filteredRequests}
        columns={columns}
        pageSize={10}
        loading={loading}
        error={error}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: 'rgba(208, 220, 223, 0.37)', // Light grey for even rows
          },
        }}
      />
      </div>
    </div>
  );
}

export default PermissionStatus;
