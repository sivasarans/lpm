import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { fetchLeaveBalance_all_users } from "../../store/reducers/leavestatus";

const leaveTypes = {
  1: "Earned Leave",
  2: "Sick Leave",
  3: "Casual Leave",
  4: "Compensatory Off",
  5: "Special Occasion Leave",
  6: "Short Maternity Leave",
  7: "Maternity Leave",
  8: "Childcare Work Leave",
  9: "On Official Duty",
  10: "Compensatory Off Leave",
  11: "Work From Home",
  12: "Weekly Off",
  13: "Marriage Permission",
  14: "Paternity Leave",
};

const LeaveBalanceCount = () => {
  const [serverError, setServerError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const userData = useSelector((state) => state.leavestatus.userData) || { user_id: "2" };
  // const leaveBalance_all_users = useSelector((state) => state.leavestatus.leaveBalance_all_users);


  const leaveBalance_all_users = useSelector(
    (state) => state.leavestatus.leaveBalance_all_users || []
  );
  console.log("leaveBalance_all_users( ( testing )):", leaveBalance_all_users);

  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLeaveBalance_all_users())
      .then(() => setServerError(false))
      .catch(() => setServerError(true));
  }, [dispatch]);

  const leaveData = useMemo(() => {
    return leaveBalance_all_users?.filter(
      (item) => String(item.userid) === String(userData.user_id)
    ) || [];
  }, [userData, leaveBalance_all_users]);

  return (
    <div className="p-2">
      {serverError ? (
        <p className="text-red-500 font-medium text-center">
          Turn on server to fetch leave data
        </p>
      ) : leaveData.length ? (
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
                  <p className="font-medium text-sm">
                    {leaveTypes[leave.l_type_id] || `Leave Type ${leave.l_type_id}`}
                  </p>
                  <p className="text-xs text-blue-500">Available: {leave.l_available} Days</p>
                  <p className="text-xs text-red-500">Availed: {leave.l_availed} Days</p>
                  <p className="text-xs text-green-500">Balance: {leave.l_balance} Days</p>
                </Box>
              </Grid>
            ))}
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
