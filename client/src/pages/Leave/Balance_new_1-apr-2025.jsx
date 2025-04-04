import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { fetchLeaveBalance_all_users } from "../../store/reducers/leavestatus";

const LeaveBalanceCount = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [serverError, setServerError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  const userData = useSelector((state) => state.leavestatus.userData) || { user_id: "1" };
  const dispatch = useDispatch();
  const leaveBalance_all_users = useSelector((state) => state.leavestatus.leaveBalance_all_users);

  useEffect(() => {
    console.log("Fetching leave balance data...");
    const fetchData = async () => {
      try {
        await dispatch(fetchLeaveBalance_all_users());
        setServerError(false);
        console.log("Leave balance data fetched successfully.");
      } catch (error) {
        console.error("Error fetching leave balance:", error);
        setServerError(true);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!userData || !leaveBalance_all_users) return;
  
    console.log("User Data:", userData);
    console.log("All Users' Leave Data:", leaveBalance_all_users);
  
    const userLeaveData = leaveBalance_all_users.filter(item => String(item.userid) === String(userData.user_id));
    console.log("Filtered User Leave Data:", userLeaveData);
  
    // Only update state if the data is different
    setLeaveData(prev => JSON.stringify(prev) !== JSON.stringify(userLeaveData) ? userLeaveData : prev);
  }, [userData, leaveBalance_all_users]);
  

  const leaveTypes = {
    "EL": "Earned Leave",
    "SL": "Sick Leave",
    "CL": "Casual Leave",
    "CO": "Compensatory Off",
    "OOD": "On Duty Leave",
    "SML": "Special Medical Leave",
    "WFH": "Work From Home",
    "A": "Annual Leave",
    "ML": "Maternity Leave",
    "PL": "Paternity Leave",
    "MP": "Marriage Leave"
  };

  return (
    <div className="p-2">
      {serverError ? (
        <p className="text-red-500 font-medium text-center">Turn on server to fetch leave data</p>
      ) : leaveData.length > 0 ? (
        <>
          <Grid container spacing={1}>
            {(showAll ? leaveData : leaveData.slice(0, 4)).map((leave) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={leave.l_type_id}>
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
                  <p className="font-medium text-sm">{leaveTypes[leave.l_type_id] || leave.l_type_id}</p>
                  <p className="text-xs text-blue-500">Available: {leave.l_available} Days</p>
                  <p className="text-xs text-red-500">Availed: {leave.l_availed} Days</p>
                  <p className="text-xs text-green-500">Balance: {leave.l_balance} Days</p>
                </Box>
              </Grid>
            ))}
          </Grid>
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                setShowAll(!showAll);
                console.log("Show all toggled: ", !showAll);
              }}
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
