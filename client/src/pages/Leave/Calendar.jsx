import React, { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import { eachDayOfInterval, format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import { Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

function AdminCalendar() {
  const [allUsers, setAllUsers] = useState([]);

  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" }
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [allLeaves, setAllLeaves] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const pickerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, leavesResponse, permissionsResponse] = await Promise.all([
          axios.get('http://localhost:3700/calender/users'),
          axios.get('http://localhost:3700/leave/get-all-status'),
          axios.get('http://localhost:3700/permission'),
        ]);
        
        setAllUsers(usersResponse.data);
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
    if (range.length > 0 && allUsers.length > 0) {
      const startDate = resetTimeToMidnight(range[0].startDate);
      const endDate = resetTimeToMidnight(range[0].endDate);
      const datesInRange = eachDayOfInterval({ start: startDate, end: endDate });
  
      // Process each day in the range
      const dailyData = [];
      datesInRange.forEach(date => {
        const currentDate = resetTimeToMidnight(date);
  
        allUsers.forEach(user => {
          const userId = user.userid;
  
          // Check for leave on current date
          const hasLeave = allLeaves.some(leave => 
            Number(leave.user_id) === Number(userId) &&
            resetTimeToMidnight(new Date(leave.from_date)) <= currentDate &&
            resetTimeToMidnight(new Date(leave.to_date)) >= currentDate
          );
  
          // Check for permission on current date
          const hasPermission = allPermissions.some(permission =>
            Number(permission.user_id) === Number(userId) &&
            resetTimeToMidnight(new Date(permission.date)).getTime() === currentDate.getTime()
          );
  
          // Determine status
          if (hasLeave) {
            const leave = allLeaves.find(leave => 
              Number(leave.user_id) === Number(userId) &&
              resetTimeToMidnight(new Date(leave.from_date)) <= currentDate &&
              resetTimeToMidnight(new Date(leave.to_date)) >= currentDate
            );
            dailyData.push({
              id: `L-${leave.id}-${currentDate.getTime()}`,
              user_id: userId,
              user_name: user.username,
              date: format(currentDate, 'dd MMM yyyy'),
              type: 'Leave',
              status: leave.status
            });
          } else if (hasPermission) {
            const permission = allPermissions.find(p =>
              Number(p.user_id) === Number(userId) &&
              resetTimeToMidnight(new Date(p.date)).getTime() === currentDate.getTime()
            );
            dailyData.push({
              id: `P-${permission.id}-${currentDate.getTime()}`,
              user_id: userId,
              user_name: user.username,
              date: format(currentDate, 'dd MMM yyyy'),
              type: 'Permission',
              status: permission.status
            });
          } else {
            dailyData.push({
              id: `U-${userId}-${currentDate.getTime()}`,
              user_id: userId,
              user_name: user.username,
              date: format(currentDate, 'dd MMM yyyy'),
              type: 'Present',
              status: 'Present'
            });
          }
        });
      });
  
      setFilteredData(dailyData);
    }
  }, [range, allLeaves, allPermissions, allUsers]);
  const statusColors = {
    Pending: 'bg-yellow-300 text-black',
    Approved: 'bg-green-300 text-white',
    Rejected: 'bg-red-300 text-white',
    Present: 'bg-blue-300 text-white' // Add new color for Present status
  };

  const columns = [
    // { field: 'userid', headerName: 'User Name', width: 200 },
    { field: 'user_id', headerName: 'User ID', width: 150 }, // Add User ID column

    { field: 'user_name', headerName: 'User Name', width: 200 },

    { 
      field: 'date', 
      headerName: 'Date', 
      width: 200,
      renderCell: (params) => (
        // params.row.type === 'Present' ? '-' : params.value
        params.value
      )
    },
    { 
      field: 'to_date', 
      headerName: 'Period', 
      width: 200,
      renderCell: (params) => (
        params.row.type === 'Present' ? 'Full Day' : params.value
      )
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 150,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-md ${
          params.value === 'Leave' ? 'bg-purple-100' : 
          params.value === 'Permission' ? 'bg-orange-100' : 
          'bg-blue-100'
        }`}>
          {params.value}
        </span>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-md ${statusColors[params.value] || 'bg-gray-200'}`}>
          {params.value}
        </span>
      )
    },
  ];

  return (
    <div 
    // className="p-6"
    >
<div className="relative flex items-center justify-between mb-10">
  {/* Breadcrumbs & Title */}
  <ul className="flex space-x-2 rtl:space-x-reverse">
    <li>
      <Link to="#" className="text-primary hover:underline">
        Calendar
      </Link>
    </li>
    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
      <span>Search</span>
    </li>
  </ul>

  <h2 className="absolute inset-x-0 text-xl font-bold text-center">Advanced Calendar</h2>

  {/* Date Picker Component - Aligned Right */}
  <div className="relative mb-4 flex items-center gap-4 justify-center">
  {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
    Details from 
  </h2> */}
  <button
    onClick={() => setShowPicker(!showPicker)}
    className="flex items-center gap-2 p-2 border rounded-lg"
  >
{`${format(range[0].startDate, "dd-MMM yyyy")} - ${format(
  range[0].endDate,
  "dd-MMM yyyy"
)}`}

    <Calendar className="w-5 h-5" />
  </button>
  {showPicker && (
    <div ref={pickerRef} className="absolute top-full mt-2 bg-white shadow-lg rounded-lg z-50 right-0 translate-x-[-20px]">
    <DateRange
        editableDateInputs={true}
        onChange={(item) => setRange([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={range}
        // minDate={new Date()}
      />
    </div>
  )}
</div>
</div>
      <Grid container spacing={3}>
        <Grid item xs={12}><div>
        </div>
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