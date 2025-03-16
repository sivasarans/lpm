import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box'; // Importing Box from MUI
import Grid from '@mui/material/Grid'; // Importing Grid from MUI
import { fetchLeaveBalance_all_users } from '../../store/reducers/leavestatus'; // Adjust the path
import { useSelector, useDispatch } from 'react-redux';

const LeaveBalanceCount = () => {
  const [leaveData, setLeaveData] = useState(null);
  const [serverError, setServerError] = useState(false);
  const userData = useSelector((state) => state.leavestatus.userData) || { user_id: 'S' };
  const dispatch = useDispatch();
  const leaveBalance_all_users = useSelector((state) => state.leavestatus.leaveBalance_all_users);

  // Fetch leave data for all users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchLeaveBalance_all_users());
        setServerError(false);
      } catch (error) {
        console.error('Error fetching leave balance:', error);
        setServerError(true);
      }
    };

    fetchData();
  }, [dispatch]);

  // Fetch leave data for the current user
  useEffect(() => {
    if (!userData || !leaveBalance_all_users) return;

    const userLeaveData = Array.isArray(leaveBalance_all_users)
      ? leaveBalance_all_users.find((item) => item.user_id === userData.user_id)
      : null;

    if (userLeaveData) {
      setLeaveData(userLeaveData);
    } else {
      setLeaveData(null);
    }
  }, [userData, leaveBalance_all_users]);

  const leaveTypes = [
    { key: 'EL', name: 'Earned Leave' },
    { key: 'SL', name: 'Sick Leave' },
    { key: 'CL', name: 'Casual Leave' },
    { key: 'CO', name: 'Compensatory Off' },
    { key: 'OOD', name: 'On Duty Leave' },
    { key: 'SML', name: 'Special Medical Leave' },
    { key: 'WFH', name: 'Work From Home' },
    { key: 'A', name: 'Annual Leave' },
    { key: 'ML', name: 'Maternity Leave' },
    { key: 'PL', name: 'Paternity Leave' },
    { key: 'MP', name: 'Marriage Leave' },
  ];

  return (
    <>
      <Box sx={{ marginBottom: 3 }}>
        <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md mb-5">
          Leave Balances
        </p>
      </Box>

      {serverError ? (
        <p className="text-red-500 font-medium">Turn on server to fetch leave data</p>
      ) : leaveData ? (
        <Grid container spacing={2}>
          {leaveTypes.map((leaveType) => (
            <Grid item xs={12} sm={6} md={4} key={leaveType.key}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  backgroundColor: 'rgb(241, 251, 255)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  boxShadow: '0px 8px 16px rgba(99, 69, 207, 0.57)',
                }}
              >
                <p className="font-medium">{leaveType.name}</p>
                <p className="text-sm text-blue-500">
                  Available: {leaveData[`${leaveType.key.toLowerCase()}_available`] || 0} Day(s)
                </p>
                <p className="text-sm text-red-500">
                  Availed: {leaveData[`${leaveType.key.toLowerCase()}_availed`] || 0} Day(s)
                </p>
                <p className="text-sm text-green-500">
                  Balance: {leaveData[`${leaveType.key.toLowerCase()}_balance`] || 0} Day(s)
                </p>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <p>No leave data available / Turn On Server</p>
      )}
    </>
  );
};

export default LeaveBalanceCount;
