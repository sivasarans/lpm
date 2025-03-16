import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests } from '../../redux/leavestatus';
import { fetchPermissions } from '../../redux/permissionsSlice';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Box, Typography, TextField, Stack } from '@mui/material';

const LeavePermissionPieCharts = () => {
  const dispatch = useDispatch();
  const { leavestatusData, userData } = useSelector((state) => state.leavestatus);
  const { permissionRequests } = useSelector((state) => state.permissions);
  const { user_id, role } = userData || {};

  const getDefaultDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const { start, end } = getDefaultDates();
  const [fromDate, setFromDate] = useState(start);
  const [toDate, setToDate] = useState(end);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
    dispatch(fetchPermissions());
  }, [dispatch]);

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

  const calculateCounts = (data, isLeave) =>
    (data || [])
      .filter(({ date, from_date, to_date, user_id: uid }) => {
        const start = new Date(isLeave ? from_date : date);
        const end = new Date(isLeave ? to_date : date);
        return (
          (role === 'Admin' || uid === user_id) &&
          (!fromDate || start >= new Date(fromDate)) &&
          (!toDate || end <= new Date(toDate))
        );
      })
      .reduce(
        (counts, { status, from_date, to_date }) => {
          const days = isLeave ? Math.max(1, (new Date(to_date) - new Date(from_date)) / (1000 * 60 * 60 * 24)) : 1;
          counts[status] = (counts[status] || 0) + days;
          return counts;
        },
        { Approved: 0, Rejected: 0, Pending: 0 }
      );

  const leaveData = calculateCounts(leavestatusData, true);
  const permissionData = calculateCounts(permissionRequests, false);

  const formatChartData = (data, isLeave) =>
    Object.entries(data).map(([label, value]) => ({
      label,
      value,
      color: isLeave ? innerChartColors[label] : commonColors[label],
    }));

  const leaveChartData = formatChartData(leaveData, true);
  const permissionChartData = formatChartData(permissionData, false);

  const renderArcLabel = (data, total) => ({ value }) =>
    `${((value / total) * 100).toFixed(0)}%`;
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
