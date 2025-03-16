import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';



const Permission = () => {


    // Add the showToast function from LeaveForm
    const showToast = (message, type) => {
      const toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
        customClass: {
          popup: type === 'success' ? 'bg-green-500' : 'bg-red-500',
        },
      });

    toast.fire({
      title: message,
    });
  };
  const [formData, setFormData] = useState({
    date: "",
    startTime: "15:00",
    endTime: "16:30",
    reason: "Enter Reason",
  });
  const [userData, setUserData] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ message: "", type: "" });
  const navigate = useNavigate();
    useEffect(() => {
      const fetchUserData = async () => {
        const storedUserData = JSON.parse(sessionStorage.getItem('user'));
        if (storedUserData) setUserData(storedUserData);
      };
      fetchUserData();
    }, []);

  useEffect(() => {
    const today = new Date();
    setFormData((prevData) => ({ ...prevData, date: today.toISOString().split("T")[0] }));

    // const storedUserData = JSON.parse(localStorage.getItem("userDetails"));
    // if (storedUserData) setUserData(storedUserData);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async () => {
  //   const { startTime, endTime, reason, date } = formData;
  //   const start = startTime.split(":").map(Number);
  //   const end = endTime.split(":").map(Number);
  //   const duration = (end[0] * 60 + end[1] - start[0] * 60 - start[1]) / 60;

  //   if (duration < 0.5 || duration > 2) {
  //     setAlertMessage({ message: "Duration must be between 30 minutes and 2 hours.", type: "error" });
  //     return;
  //   }

  //   if (!reason.trim()) {
  //     setAlertMessage({ message: "Reason is required!", type: "error" });
  //     return;
  //   }

  //   try {
  //     const payload = { user_id: userData.user_id, date, in_time: startTime, out_time: endTime, reason };
  //     // Simulate a successful response
  //     setAlertMessage({ message: "Permission request submitted successfully!", type: "success" });
  //     handleReset();
  //   } catch (error) {
  //     console.error("Error submitting permission request:", error);
  //     setAlertMessage({ message: "Failed to submit permission request.", type: "error" });
  //   }
  // };
  const handleSubmit = async () => {
    const { startTime, endTime, reason, date } = formData;
    console.log("formData: " , formData)
    const start = startTime.split(":").map(Number);
    const end = endTime.split(":").map(Number);
    const duration = (end[0] * 60 + end[1] - start[0] * 60 - start[1]) / 60;
    console.log("Start Time Parsed:", start);
    console.log("End Time Parsed:", end);
    console.log("Calculated Duration:", duration);
  
  
    if (duration < 0.5 || duration > 2) {
      showToast("Duration must be between 30 minutes and 2 hours.", "error");
      return;
    }
  
   
    if (!reason.trim()) {
      showToast("Reason is required!", "error");
      return;
    }
  
    try {
      const payload = {
        user_id: userData?.userid || "1000",
        user_name: userData?.name || "Sample_User",
        date,
        in_time: startTime,
        out_time: endTime,
        reason,
      };
  console.log("payload: ", payload);
      const response = await axios.post("http://localhost:3700/permission", payload );

      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });
      // const response = await axios.post('http://localhost:3700/leave/apply_leave', leaveRequest);

  
      // const result = await response.json();
      
      if (response.status === 200) {
        showToast("Permission request submitted successfully!", "success");

        handleReset();
      
      } 
      
      // else {
      //   console.error("Error Response:", response);

      //   setAlertMessage({ message: result.message || "Failed to submit permission request.", type: "error" });
      // }
    }  catch (error) {
      // Enhanced error handling
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          "Failed to submit permission request";
      
      console.error("Submission Error:", {
        error,
        response: error.response?.data
      });
      
      showToast(errorMessage, "error");

    }
  };
  
  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      startTime: "15:00",
      endTime: "16:30",
      reason: "",
    });
  };

  useEffect(() => {
    if (alertMessage.message) {
      const timer = setTimeout(() => setAlertMessage({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (

    <div 
    // className="w-full p-6 rounded-lg shadow-md mt-10"
    >
    <div className="relative flex items-center mb-10">
    <ul className="flex space-x-2 rtl:space-x-reverse">
      <li>
        <Link to="#" className="text-primary hover:underline">
          Permission
        </Link>
      </li>
      <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
        <span>Apply</span>
      </li>
      <li>
      {userData ? (
    <div className="text-sm text-gray-700 mb-4">  {/* Increased mt-40 to mt-60 for more space */}
              <span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
              User: "{userData.name}"
              </span>
    </div>
  ) : 
  <span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
    {"Sample User, Admin"}
  </span>
  }
      </li>
    </ul>
    <h2 className="absolute inset-x-0 text-xl font-bold text-center">Permission Request</h2>
  </div>


{alertMessage.message && (
  <div
    className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md w-80 text-center z-50 ${
      alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`}
  >
    {alertMessage.message}
  </div>
)}

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="date" className="block font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 form-input rounded-md"
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 form-input rounded-md"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 form-input rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="reason" className="block font-medium text-gray-700 mb-1">Reason</label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 form-input rounded-md"
          required
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 shadow-lg"
      >
        Submit
      </button>
    </div>
  );
};

export default Permission;
