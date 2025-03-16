import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Menu } from "@headlessui/react";
import axios from "axios";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // Fetch users (unchanged)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/attandance/users");
      setUsers(
        response.data.users.map((user) => ({
          ...user,
          attendance: {}, // Initialize attendance object
        }))
      );
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  // Fetch attendance for the selected date
  const fetchAttendance = async (date) => {
    try {
      const response = await axios.get("http://localhost:5000/attandance", {
        params: { date },
      });
      if (response.data.success) {
        const attendanceMap = response.data.attendance_date.reduce((acc, record) => {
          acc[record.user_id] = {
            in: record.in_time,
            out: record.out_time,
            updatedAt: record.updated_at || "N/A",
          };
          return acc;
        }, {});

        setUsers((prevUsers) =>
          prevUsers.map((user) => ({
            ...user,
            attendance: {
              ...user.attendance,
              [date]: attendanceMap[user.user_id] || {},
            },
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    }
  };

  const setDefaultTimes = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (!user.attendance[selectedDate]) user.attendance[selectedDate] = {};
  
        // Check if 'in' time is either missing or set to "00:00:00"
        if (!user.attendance[selectedDate].in || user.attendance[selectedDate].in === "00:00:00") {
          user.attendance[selectedDate].in = "09:30:00";
        }
  
        // Check if 'out' time is either missing or set to "00:00:00"
        if (!user.attendance[selectedDate].out || user.attendance[selectedDate].out === "00:00:00") {
          user.attendance[selectedDate].out = "17:00:00";
        }
  
        return user;
      })
    );
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleUpdate = (id, type, value) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        if (!user.attendance[selectedDate]) user.attendance[selectedDate] = {};
        user.attendance[selectedDate][type] = value;
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleSubmitAll = async () => {
    const attendanceData = users.map((user) => ({
      userId: user.user_id,
      name: user.name,
      date: selectedDate,
      inTime: user.attendance[selectedDate]?.in || "00:00:00",
      outTime: user.attendance[selectedDate]?.out || "00:00:00",
    }));

    try {
      const response = await axios.post("http://localhost:5000/attandance/bulk-update", attendanceData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        fetchAttendance(selectedDate); // Refresh attendance data
        setSuccessMessage("Attendance updated successfully!"); // Show success message
        setTimeout(() => setSuccessMessage(""), 3000); // Hide message after 3 seconds
      }
    } catch (err) {
      console.error("Error updating attendance for all users:", err);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "in",
      headerName: "In Time",
      width: 150,
      renderCell: (params) => (
        <input
          type="time"
          value={params.row.attendance[selectedDate]?.in || "00:00"}
          onChange={(e) => handleUpdate(params.row.id, "in", e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      ),
    },
    {
      field: "out",
      headerName: "Out Time",
      width: 150,
      renderCell: (params) => (
        <input
          type="time"
          value={params.row.attendance[selectedDate]?.out || "00:00"}
          onChange={(e) => handleUpdate(params.row.id, "out", e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 180,
      renderCell: (params) =>
        params.row.attendance[selectedDate]?.updatedAt || "Not Made Attandance",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Attendance Tracker</h1>

      {successMessage && (
        <div className="w-full bg-green-500 text-white text-center py-2 mb-4">
          {successMessage}
        </div>
      )}

      <div className="mb-4 flex items-center space-x-4">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="px-2 py-1 border rounded"
        />
        <button
          onClick={setDefaultTimes}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Set Default Times
        </button>
        <button
          onClick={handleSubmitAll}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Update Attendance
        </button>
      </div>

      <div className = "w-full bg-white shadow-md rounded-lg p-4 m-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            className="bg-gray-50"
            getRowId={(row) => row.user_id} // Unique identifier for rows
          />
        )}
      </div>
    </div>
  );
};

export default Attendance;
