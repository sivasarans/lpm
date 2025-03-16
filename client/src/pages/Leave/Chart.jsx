import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Box, Typography, TextField } from '@mui/material';

const LeavePermissionPieCharts = () => {
  const [leavestatusData, setLeavestatusData] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [userData, setUserData] = useState({ userid: 123, role: null });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  console.log('Component rendered');

  // Fetch user data from sessionStorage
  useEffect(() => {
    console.log('Fetching user data from sessionStorage...');
    const storedUserData = sessionStorage.getItem('user');
    if (storedUserData) {
      const userDetails = JSON.parse(storedUserData);
      console.log('User data retrieved from sessionStorage:', userDetails);
      setUserData(userDetails);
      setIsAdminMode(userDetails.role_lpm === 'Admin');
    } else {
      console.error('No user data found in sessionStorage');
    }
  }, []);

  // Fetch leave and permission data
  useEffect(() => {
    console.log('Fetching leave and permission data...');
    const fetchData = async () => {
      if (userData.userid) {
        try {
          const leaveResponse = await axios.get('http://localhost:3700/leave/get-all-status');
          console.log('Leave data fetched:', leaveResponse.data);
          setLeavestatusData(leaveResponse.data);

          const permissionResponse = await axios.get('http://localhost:3700/permission');
          console.log('Permission data fetched:', permissionResponse.data.result);
          setPermissionRequests(permissionResponse.data.result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [userData]);

  // Set default dates
  const getDefaultDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    console.log('Setting default dates...');
    const { start, end } = getDefaultDates();
    setFromDate(start);
    setToDate(end);
  }, []);

  // Colors for charts
  const commonColors = {
    Approved: '#32CD32', // Green
    Rejected: '#FF0000', // Red
    Pending: '#FFA07A', // Orange
  };

  const innerChartColors = {
    Approved: '#7CFC00', // Lighter green for inner chart
    Rejected: '#FF6347', // Lighter red for inner chart
    Pending: '#FFD700', // Lighter yellow for inner chart
  };

  // Calculate counts for leave and permission data
  const calculateCounts = (data, isLeave) => {
    console.log('Calculating counts for:', isLeave ? 'Leave' : 'Permission');
    const filteredData = (data || []).filter(({ date, from_date, to_date, user_id: uid }) => {
      const start = new Date(isLeave ? from_date : date);
      const end = new Date(isLeave ? to_date : date);
      return (
        (isAdminMode || uid === userData.user_id) &&
        (!fromDate || start >= new Date(fromDate)) &&
        (!toDate || end <= new Date(toDate))
      );
    });

    console.log('Filtered data:', filteredData);

    const counts = filteredData.reduce(
      (acc, { status, from_date, to_date }) => {
        const days = isLeave ? Math.max(1, (new Date(to_date) - new Date(from_date)) / (1000 * 60 * 60 * 24)) : 1;
        acc[status] = (acc[status] || 0) + days;
        return acc;
      },
      { Approved: 0, Rejected: 0, Pending: 0 }
    );

    console.log('Calculated counts:', counts);
    return counts;
  };

  const leaveData = calculateCounts(leavestatusData, true);
  const permissionData = calculateCounts(permissionRequests, false);

  // Format chart data
  const formatChartData = (data, isLeave) => {
    console.log('Formatting chart data for:', isLeave ? 'Leave' : 'Permission');
    const formattedData = Object.entries(data).map(([label, value]) => ({
      label,
      value,
      color: isLeave ? innerChartColors[label] : commonColors[label],
    }));

    console.log('Formatted chart data:', formattedData);
    return formattedData;
  };

  const leaveChartData = formatChartData(leaveData, true);
  const permissionChartData = formatChartData(permissionData, false);

  // Render arc labels for the chart
  const renderArcLabel = (data, total) => ({ value }) =>
    `${((value / total) * 100).toFixed(0)}%`;

  console.log('Leave chart data:', leaveChartData);
  console.log('Permission chart data:', permissionChartData);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgb(233,231,255)', boxShadow: '0px 8px 16px rgb(140, 15, 248)', width: '100%', maxWidth: 600 }}>
        <Typography variant="h6" align="center" sx={{ mb: 2, color: 'rgb(66,23,115)' }}>
          Leave and Permission Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            sx={{ width: '50%' }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            sx={{ width: '50%' }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Typography align="center" variant="subtitle1" sx={{ mb: 2 }}>
          Outer Chart: Leave Data | Inner Chart: Permission Data
        </Typography>
        <PieChart
          series={[
            {
              data: permissionChartData,
              innerRadius: 0,
              outerRadius: 80,
              arcLabel: renderArcLabel(permissionChartData, permissionChartData.reduce((a, b) => a + b.value, 0)),
            },
            {
              data: leaveChartData,
              innerRadius: 90,
              outerRadius: 120,
              arcLabel: renderArcLabel(leaveChartData, leaveChartData.reduce((a, b) => a + b.value, 0)),
            },
          ]}
          sx={{ [`& .${pieArcLabelClasses.root}`]: { fill: 'blue', fontSize: 14 } }}
          width={400}
          height={400}
        />
      </Box>
    </Box>
  );
};

export default LeavePermissionPieCharts;