import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { fetchLeaveBalance_all_users } from "../../store/reducers/leavestatus";

const LeaveBalanceCount = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [serverError, setServerError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const userData = useSelector((state) => state.leavestatus.userData) || { userid: "S" };
  const dispatch = useDispatch();
  const leaveBalance_all_users = useSelector((state) => state.leavestatus.leaveBalance_all_users);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchLeaveBalance_all_users());
        setServerError(false);
      } catch (error) {
        console.error("Error fetching leave balance:", error);
        setServerError(true);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!userData || !leaveBalance_all_users) return;
    
    // Match the user's leave balance based on userid
    const userLeaveData = leaveBalance_all_users.filter((item) => item.userid === userData.userid);
    setLeaveData(userLeaveData || []);
  }, [userData, leaveBalance_all_users]);

  const leaveTypes = [
    { key: "EL", name: "Earned Leave" },
    { key: "SL", name: "Sick Leave" },
    { key: "CL", name: "Casual Leave" },
    { key: "CO", name: "Compensatory Off" },
    { key: "OOD", name: "On Duty Leave" },
    { key: "SML", name: "Special Medical Leave" },
    { key: "A", name: "Annual Leave" },
    { key: "ML", name: "Maternity Leave" },
    { key: "PL", name: "Paternity Leave" },
    { key: "MP", name: "Marriage Leave" },
  ];

  return (
    <div className="p-2">
      {serverError ? (
        <p className="text-red-500 font-medium text-center">Turn on server to fetch leave data</p>
      ) : leaveData.length > 0 ? (
        <>
          <Grid container spacing={1}>
            {(showAll ? leaveTypes : leaveTypes.slice(0, 4)).map((leaveType) => {
              const leaveInfo = leaveData.find((item) => item.l_type_id === leaveType.key) || {};
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={leaveType.key}>
                  <Box
                    sx={{
                      p: 1.5,
                      border: 1,
                      backgroundColor: "rgb(241, 251, 255)",
                      borderRadius: "6px",
                      textAlign: "center",
                      boxShadow: "0px 4px 8px rgba(99, 69, 207, 0.5)",
                    }}
                  >
                    <p className="font-medium text-sm">{leaveType.name}</p>
                    <p className="text-xs text-blue-500">
                      Available: {leaveInfo.l_available || 0} Days
                    </p>
                    <p className="text-xs text-red-500">
                      Availed: {leaveInfo.l_availed || 0} Days
                    </p>
                    <p className="text-xs text-green-500">
                      Balance: {(leaveInfo.l_available || 0) - (leaveInfo.l_availed || 0)} Days
                    </p>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <div className="mt-3 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-center">No leave data available / Turn On Server</p>
      )}
    </div>
  );
};

export default LeaveBalanceCount;
