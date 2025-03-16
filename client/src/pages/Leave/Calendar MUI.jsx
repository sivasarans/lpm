import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function AdminCalendar() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [allLeaves, setAllLeaves] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leavesResponse = await axios.get('http://localhost:3700/leave/get-all-status');
        const permissionsResponse = await axios.get('http://localhost:3700/permission');
        
        setAllLeaves(leavesResponse.data);
        setAllPermissions(permissionsResponse.data.result); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const resetTimeToMidnight = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  useEffect(() => {
    if (fromDate && toDate) {
      const resetFromDate = resetTimeToMidnight(fromDate);
      const resetToDate = resetTimeToMidnight(toDate);

      const filteredLeaves = allLeaves.filter((leave) => {
        const leaveFromDate = resetTimeToMidnight(new Date(leave.from_date));
        const leaveToDate = resetTimeToMidnight(new Date(leave.to_date));
        return leaveFromDate >= resetFromDate && leaveToDate <= resetToDate;
      });

      const filteredPermissions = allPermissions.filter((permission) => {
        const permissionDate = resetTimeToMidnight(new Date(permission.date));
        return permissionDate >= resetFromDate && permissionDate <= resetToDate;
      });

      const combinedData = [
        ...filteredLeaves.map((leave) => ({
          id: `L-${leave.id}`,
          user_name: leave.user_name,
          from_date: new Date(leave.from_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          to_date: new Date(leave.to_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          type: 'Leave',
          status: leave.status,
        })),
        ...filteredPermissions.map((permission) => ({
          id: `P-${permission.id}`,
          user_name: permission.user_name,
          from_date: new Date(permission.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          to_date: '-',
          type: 'Permission',
          status: permission.status,
        })),
      ];

      setFilteredData(combinedData);
    } else {
      setFilteredData([]);
    }
  }, [fromDate, toDate, allLeaves, allPermissions]);

  const columns = [
    { field: 'user_name', headerName: 'User Name', width: 200 },
    { field: 'from_date', headerName: 'From', width: 200 },
    { field: 'to_date', headerName: 'To', width: 200 },
    { field: 'type', headerName: 'Type', width: 150 },
    // { field: 'status', headerName: 'Status', width: 150 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => {
        const statusColors = {
          Pending: 'bg-yellow-300 text-black',
          Approved: 'bg-green-300 text-white',
          Rejected: 'bg-red-300 text-white',
        };
        
        return (
          <span className={`px-2 py-1 rounded-md ${statusColors[params.value] || 'bg-gray-200 text-black'}`}>
            {params.value}
          </span>
        );
      }
    },
  ];

  return (
    <div className="p-6">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1 className="text-2xl font-bold mb-4">Leave & Permission Calendar</h1>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={5}>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Select From Date</h2>
                <DatePicker
                  selected={fromDate}
                  onChange={setFromDate}
                  dateFormat="dd-MMM-yyyy"
                  className="form-input"
                  placeholderText="Select From Date"
                />
              </div>
            </Grid>

            <Grid item xs={12} md={5}>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Select To Date</h2>
                <DatePicker
                  selected={toDate}
                  onChange={setToDate}
                  dateFormat="dd-MMM-yyyy"
                  className="form-input"
                  placeholderText="Select To Date"
                />
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Details from {fromDate?.toDateString()} to {toDate?.toDateString()}
          </h2>

          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
              rows={filteredData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              checkboxSelection
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminCalendar;
