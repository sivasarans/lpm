import React, { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import { Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';


function AdminCalendar() {
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
    if (range.length > 0) {
      const startDate = range[0].startDate;
      const endDate = range[0].endDate;
      
      const resetFromDate = resetTimeToMidnight(startDate);
      const resetToDate = resetTimeToMidnight(endDate);

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
    }
  }, [range, allLeaves, allPermissions]);

  const columns = [
    { field: 'user_name', headerName: 'User Name', width: 200 },
    { field: 'from_date', headerName: 'From', width: 200 },
    { field: 'to_date', headerName: 'To', width: 200 },
    { field: 'type', headerName: 'Type', width: 150 },
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