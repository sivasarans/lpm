import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box, Typography, TextField, Grid, useMediaQuery, useTheme } from '@mui/material';

const LeavePermissionChart = () => {
  const [leavestatusData, setLeavestatusData] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [userData, setUserData] = useState({ userid: null, role: null });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filters, setFilters] = useState({ Pending: true, Rejected: true, Approved: true, Total: false });
  const [savedFilters, setSavedFilters] = useState({ Pending: true, Rejected: true, Approved: true });
  const [dataType, setDataType] = useState('Permission');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch user data from sessionStorage
  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    if (storedUserData) {
      const userDetails = JSON.parse(storedUserData);
      setUserData(userDetails);
    }
  }, []);

  // Fetch leave and permission data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const leaveResponse = await axios.get('http://localhost:3700/leave/get-all-status');
        setLeavestatusData(leaveResponse.data);

        const permissionResponse = await axios.get('http://localhost:3700/permission');
        setPermissionRequests(permissionResponse.data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userData.userid) {
      fetchData();
    }
  }, [userData]);

  // Set default date range
  useEffect(() => {
    const today = new Date();
    const defaultFromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().slice(0, 10);
    setFromDate(defaultFromDate);
    setToDate(new Date().toISOString().slice(0, 10));
  }, []);

  // Helper functions
  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  const calculateDays = (from, to) => Math.max(0, (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1);

  // Filter and process leave data
  const filteredLeaveData = leavestatusData
    .filter((entry) => {
      const entryDate = new Date(entry.from_date || entry.date);
      const isAdmin = userData.role === 'Admin';
      return (
        (!fromDate || entryDate >= new Date(fromDate)) &&
        (!toDate || entryDate <= new Date(toDate)) &&
        (isAdmin || entry.user_id === userData.user_id)
      );
    })
    .reduce((acc, entry) => {
      const date = formatDate(entry.from_date || entry.date);
      const days = calculateDays(entry.from_date, entry.to_date) || 1;
      if (!acc[date]) acc[date] = { date, Pending: 0, Rejected: 0, Approved: 0, Total: 0 };
      acc[date][entry.status] += days;
      acc[date].Total += days;
      return acc;
    }, {});

  // Filter and process permission data
  const filteredPermissionData = permissionRequests
    .filter((permission) => {
      const permissionDate = new Date(permission.date);
      const isAdmin = userData.role === 'Admin';
      return (
        (!fromDate || permissionDate >= new Date(fromDate)) &&
        (!toDate || permissionDate <= new Date(toDate)) &&
        (isAdmin || permission.user_id === userData.user_id)
      );
    })
    .map((permission) => ({
      date: formatDate(permission.date),
      Pending: permission.status === 'Pending' ? 1 : 0,
      Rejected: permission.status === 'Rejected' ? 1 : 0,
      Approved: permission.status === 'Approved' ? 1 : 0,
      Total: 1,
    }));

  // Sort leave data by date
  const sortedLeaveData = Object.values(filteredLeaveData).sort((a, b) => new Date(a.date) - new Date(b.date));
  const dataset = dataType === 'Permission' ? filteredPermissionData : sortedLeaveData;

  // Handle filter changes
  const handleFilterChange = (status) => {
    if (status === 'Total') {
      const newTotalState = !filters.Total;
      if (newTotalState) {
        setSavedFilters({ Pending: filters.Pending, Rejected: filters.Rejected, Approved: filters.Approved });
        setFilters({ Pending: false, Rejected: false, Approved: false, Total: true });
      } else {
        setFilters({ ...savedFilters, Total: false });
      }
    } else {
      setFilters((prev) => ({ ...prev, [status]: !prev[status] }));
    }
  };

  // Chart settings
  const chartSettings = {
    dataset,
    height: isSmallScreen ? 200 : 300,
    xAxis: [{ scaleType: 'band', dataKey: 'date' }],
    series: [
      filters.Pending && { dataKey: 'Pending', label: 'Pending', color: 'orange', stack: 'stack' },
      filters.Rejected && { dataKey: 'Rejected', label: 'Rejected', color: 'red', stack: 'stack' },
      filters.Approved && { dataKey: 'Approved', label: 'Approved', color: 'green', stack: 'stack' },
      filters.Total && { dataKey: 'Total', label: 'Total', color: 'blue', stack: 'stack' },
    ].filter(Boolean),
  };

  return (
    <Box sx={{ padding: isSmallScreen ? 2 : 4 }}>
      {loading && <Typography>Loading permission data...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      <Box
        sx={{
          boxShadow: '0 4px 8px rgba(237, 16, 237, 0.96)',
          padding: isSmallScreen ? 2 : 4,
          marginBottom: 4,
          borderRadius: 2,
          backgroundColor: '#ffe6e6',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{ mb: 2, color: 'rgb(66,23,115)' }}>
              Leave and Permission Status
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ToggleButtonGroup
              fullWidth
              color="primary"
              value={dataType}
              exclusive
              onChange={(e, type) => setDataType(type || dataType)}
              aria-label="Data Type"
            >
              {['Permission', 'Leave'].map((type) => (
                <ToggleButton key={type} value={type} sx={{ fontWeight: dataType === type ? 'bold' : 'normal' }}>
                  {type} Data
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <FormGroup row>
              {['Pending', 'Rejected', 'Approved', 'Total'].map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      checked={filters[status]}
                      onChange={() => handleFilterChange(status)}
                      disabled={status !== 'Total' && filters.Total}
                    />
                  }
                  label={status}
                />
              ))}
            </FormGroup>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          boxShadow: '0 6px 10px rgba(244, 8, 216, 0.88)',
          borderRadius: 2,
          backgroundColor: '#ffe6e6',
          padding: isSmallScreen ? 2 : 4,
        }}
      >
        <BarChart {...chartSettings} />
      </Box>
    </Box>
  );
};

export default LeavePermissionChart;