import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, IconButton, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

function LeaveAssign() {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch leave default data
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch('http://localhost:3700/leave/admin');
        const data = await response.json();
        setLeaveData(data);
        console.log("leaveData:",leaveData);
      } catch (err) {
        setError('Failed to load leave data.');
      }
    };
    fetchLeaveData();
  }, []);

  // const handleSendToBackend = async (row) => {
  //   console.log('Row data before sending:', row); // Debugging log
  //   const payload = {
  //     role_name: row.role_name,
  //     EL_default: parseFloat(row.el_default) || 0,
  //     SL_default: parseFloat(row.sl_default) || 0,
  //     CL_default: parseFloat(row.cl_default) || 0,
  //     CO_default: parseFloat(row.co_default) || 0,
  //     OOD_default: parseFloat(row.ood_default) || 0,
  //     WFH_default: parseFloat(row.wfh_default) || 0,
  //     ML_default: parseFloat(row.ml_default) || 0,
  //     PL_default: parseFloat(row.pl_default) || 0,
  //     MP_default: parseFloat(row.mp_default) || 0,
  //   };
  //   console.log('Payload being sent:', payload); // Log the payload
  
  //   try {
  //     const response = await fetch('http://localhost:5000/leave/admin/update', {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });
  //     if (!response.ok) throw new Error('Error updating leave defaults');
  //     setSuccessMessage('Leave defaults updated successfully!');
  //   } catch (err) {
  //     setError('Failed to update leave defaults.');
  //   }
  // };
  const handleSendToBackend = async (row) => {
    console.log('Row data before sending:', row); // Debugging log
    const payload = {
      role_name: row.role_name,
      el_default: parseFloat(row.el_default) || 0,
      sl_default: parseFloat(row.sl_default) || 0,
      cl_default: parseFloat(row.cl_default) || 0,
      co_default: parseFloat(row.co_default) || 0,
      ood_default: parseFloat(row.ood_default) || 0,
      wfh_default: parseFloat(row.wfh_default) || 0,
      ml_default: parseFloat(row.ml_default) || 0,
      pl_default: parseFloat(row.pl_default) || 0,
      mp_default: parseFloat(row.mp_default) || 0,
    };
    console.log('Payload being sent:', payload); // Log the payload
  
    try {
      const response = await fetch('http://localhost:3700/leave/admin/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Error updating leave defaults');
      setSuccessMessage('Leave defaults updated successfully!');
    } catch (err) {
      setError('Failed to update leave defaults.');
    }
  };
  

  const columns = [
    {
      field: 'actions',
      headerName: 'Update',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => {
          handleSendToBackend(params.row)}}>
          <CheckIcon />
        </IconButton>
      ),
    },
    { field: 'role_name', headerName: 'Role', width: 200 },
    { field: 'el_default', headerName: 'Earned Leave', width: 120, editable: true },
    { field: 'sl_default', headerName: 'Sick Leave', width: 120, editable: true },
    { field: 'cl_default', headerName: 'Casual Leave', width: 120, editable: true },
    { field: 'co_default', headerName: 'Comp Off', width: 120, editable: true },
    { field: 'ood_default', headerName: 'On-Duty Leave', width: 120, editable: true },
    { field: 'wfh_default', headerName: 'Work From Home', width: 120, editable: true },
    { field: 'ml_default', headerName: 'Marriage Leave', width: 120, editable: true },
    { field: 'pl_default', headerName: 'Paternity Leave', width: 120, editable: true },
    { field: 'mp_default', headerName: 'Maternity Leave', width: 120, editable: true },
  ];


  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <h3 className="text-2xl font-bold mb-6">Leave Default Settings</h3>

      {successMessage && (
        <Alert variant="filled" severity="success" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Alert>
      )}
      {error && <Box sx={{ color: 'red', mb: 2 }}>{error}</Box>}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={leaveData}
          columns={columns}
          pageSize={10}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          getRowId={(row) => row.role_name}
          onCellEditCommit={(params) => {
            const updatedData = leaveData.map((row) =>
              row.role_name === params.id
                ? { ...row, [params.field]: parseFloat(params.value) || row[params.field] }
                : row
            );
            setLeaveData(updatedData);
          }}
        />
      </Box>
    </Box>
  );
}

export default LeaveAssign;
