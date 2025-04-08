import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector , useDispatch } from 'react-redux';
import { applyLeave , fetchLeaveData } from "../../store/reducers/leavestatus";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DateRange } from 'react-date-range';
import { format } from "date-fns";
import { Calendar } from 'lucide-react';
import { addDays } from 'date-fns';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import LeaveBalanceCount from './Balance';

const LeaveForm = () => {
  const leaveTypes = [
    { value: 1, short: 'EL', full: 'Earned Leave' },
    { value: 2, short: 'SL', full: 'Sick Leave' },
    { value: 3, short: 'CL', full: 'Casual Leave' },
    { value: 4, short: 'CO', full: 'Compensatory Off' },
    { value: 5, short: 'SO', full: 'Special Occasion Leave' },
    { value: 6, short: 'SML', full: 'Short Maternity Leave' },
    { value: 7, short: 'ML', full: 'Maternity Leave' },
    { value: 8, short: 'CW', full: 'Childcare Work Leave' },
    { value: 9, short: 'OOD', full: 'On Official Duty' },
    { value: 10, short: 'COL', full: 'Compensatory Off Leave' },
    { value: 11, short: 'WFH', full: 'Work From Home' },
    { value: 12, short: 'WO', full: 'Weekly Off' },
    { value: 13, short: 'MP', full: 'Marriage Permission' },
    { value: 14, short: 'PL', full: 'Paternity Leave' },
  ];
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef();

  const [leaveDays, setLeaveDays] = useState(1);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  // Update leave days when the range changes
  useEffect(() => {
    const days = Math.ceil(
      (range[0].endDate - range[0].startDate) / (1000 * 60 * 60 * 24)
    ) + 1;
    setLeaveDays(days);
  }, [range]);
  useEffect(() => {
    const handleClickOutside = (e) =>
      pickerRef.current &&
      !pickerRef.current.contains(e.target) &&
      setShowPicker(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [isFileUploadVisible, setIsFileUploadVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { leavebalance } = useSelector((state) => state.leavestatus);
  const xxx = dispatch(fetchLeaveData);

  const [leaveType, setLeaveType] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("Enter reason");
  // const [leaveDays, setLeaveDays] = useState(1);
  const [leaveData, setLeaveData] = useState({});
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });

  useEffect(() => {
    const today = new Date();
    setFromDate(today.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = JSON.parse(sessionStorage.getItem('user'));
      if (storedUserData) setUserData(storedUserData);
    };
    fetchUserData();
    console.log('Fetching user data:', userData);
  }, []);

  useEffect(() => {
    const fetchLeaveData = async () => {
      if (!userData || !Array.isArray(leavebalance)) return;
      try {
        const userLeaveData = leavebalance.filter(item => item.user_id === userData.user_id);
        if (userLeaveData.length) setLeaveData(userLeaveData[0]);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };
    fetchLeaveData();
  }, [userData, leavebalance]);

  useEffect(() => {
    if (fromDate && toDate) {
      const days = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) + 1;
      setLeaveDays(days);
    }
  }, [fromDate, toDate]);

  // useEffect(() => {
  //   if (
  //     leaveType === "ML" || 
  //     leaveType === "ml" || 
  //     leaveType === "SML" || 
  //     leaveType === "pl" || 
  //     leaveType === "PL" || 
  //     leaveType === "sml"
  //   ) {
  //     setIsFileUploadVisible(true);
  //   } else {
  //     setIsFileUploadVisible(false);
  //   }
  // }, [leaveType]);

  useEffect(() => {
    // Leave types requiring file upload: SML(6), ML(7), PL(14)
    if ([6, 7, 14].includes(leaveType)) {
      setIsFileUploadVisible(true);
    } else {
      setIsFileUploadVisible(false);
    }
  }, [leaveType]);


  const handleApply = async () => {
    console.log("Applying leave with type:", leaveType); // Log leaveType
    if (!fromDate || !toDate || !leaveType || !reason || leaveDays <= 0) {
      showToast('All fields are required with valid inputs!', 'error');
      return;
    }
    const selectedLeave = leaveTypes.find(lt => lt.value === leaveType);
  if (!selectedLeave) {
    showToast('Invalid leave type selected', 'error');
    return;
  }
  if (leaveData[selectedLeave.short.toLowerCase()] < leaveDays) {
    showToast("Insufficient leave balance", 'error');
    return;
  }

  
    // if (leaveData && leaveData[leaveType.toLowerCase()] < leaveDays) {
    //   showToast("Insufficient leave balance", 'error');
    //   return;
    // }
  
    const formData = new FormData(); // Use FormData for file uploads
    formData.append("user_id", userData?.userid || "1000");
    formData.append("user_name", userData?.name || "Unknown");
    formData.append("mail", userData?.mail || "milkymistofficial@gmail.com");
    formData.append("leave_type", leaveType);
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("leave_days", leaveDays);
    formData.append("reason", reason);
    if (file) formData.append("file", file); // Add file only if it exists
    formData.forEach((value, key) => {
      console.log(`sss ${key} :`, value);
  });
    
    // try {
    //   const resultAction = await dispatch(applyLeave(formData));
    //   if (applyLeave.fulfilled.match(resultAction)) {
    //     const extraResponse = await fetch("http://localhost:3700/leave/apply-leave", {
    //       method: "POST",
    //       body: formData, 
    //     });
    
    //     const extraResult = await extraResponse.json();
    //     console.log("Extra server response:", extraResult);
    //     showToast('Leave applied both servers and balance updated successfully!', 'success');
    //     handleReset();
    //   } else {
    //     showToast(resultAction.payload || 'Error occurred while applying leave', 'error');
    //   }
    // } catch (error) {
    //   console.error("Error applying for leave:", error);
    //   showToast('Server error occurred while submitting the form.', 'error');
    // }

    try {
      const resultAction = await dispatch(applyLeave(formData));
    
      if (applyLeave.fulfilled.match(resultAction)) {
        showToast('Leave applied successfully!', 'success');
        handleReset();
      } else {
        showToast(resultAction.payload || 'Error occurred while applying leave', 'error');
      }
    } catch (error) {
      console.error("Error applying for leave:", error);
      showToast('Server error occurred while submitting the form.', 'error');
    }
    
  };
  
  // Show SweetAlert2 toast notification
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
  

  useEffect(() => {
    if (alertMessage.message) {
      const timer = setTimeout(() => setAlertMessage({ message: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleReset = () => {
    setLeaveType(1);
    setFromDate(toDate);
    setReason("Enter reason");
    setLeaveDays(1);
    setFile(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const BackToStatus = () => {
    navigate('/leavestatus');
  };
return (
    <div 
    // className="w-full p-6 rounded-lg shadow-md mt-10"
    >
<div className="relative flex items-center mb-10">
  <ul className="flex space-x-2 rtl:space-x-reverse">
    <li>
      <Link to="#" className="text-primary hover:underline">
        Leave
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

    {/* <p className="inline-block px-2 py-1 m-2 rounded-md">User: "{userData.name}"</p> */}
    {/* <p className="inline-block px-2 py-1 m-2 rounded-md">User ID: {userData.userid}</p> */}
  </div>
) : 
<span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
  {"Sample User, Admin"}
</span>
}
    </li>
  </ul>
  <h2 className="absolute inset-x-0 text-xl font-bold text-center">Apply Leave</h2>
</div>

<div>
  <LeaveBalanceCount/>
</div>

<div className="panel mt-4" id="forms_grid">
  <div>
     <label className="block font-medium text-gray-700 dark:text-gray-300 mt-2">Leave Type *</label>
  {/* <select
  className="form-input"
  value={leaveType}
  onChange={(e) => setLeaveType(e.target.value)} // Sends the short form as the value
>
  {[
    { short: "EL", full: "Earned Leave" },
    { short: "SL", full: "Sick Leave" },
    { short: "CL", full: "Casual Leave" },
    { short: "CO", full: "Compensatory Off" },
    { short: "SO", full: "Special Occasion Leave" },
    { short: "SML", full: "Short Maternity Leave" },
    { short: "ML", full: "Maternity Leave" },
    { short: "CW", full: "Childcare Work Leave" },
    { short: "OOD", full: "On Official Duty" },
    { short: "COL", full: "Compensatory Off Leave" },
    { short: "WFH", full: "Work From Home" },
    { short: "WO", full: "Weekly Off" },
    { short: "MP", full: "Marriage Permission" },
    { short: "PL", full: "Paternity Leave" },
  ].map((leave) => (
    <option key={leave.short} value={leave.short}>
      {leave.full} 
    </option>
  ))}
</select> */}
<select
            className="form-input"
            value={leaveType}
            onChange={(e) => setLeaveType(Number(e.target.value))}
          >
            {leaveTypes.map((leave) => (
              <option key={leave.value} value={leave.value}>
                {leave.full}
              </option>
            ))}
          </select>

  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mt-4">
    <div>
    <label className="block font-semibold mb-1">Select Date Range:</label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          readOnly
          value={format(range[0].startDate, "dd MMM yyyy")}
          onClick={() => setShowPicker(true)}
          className="form-input"
          />
        <span>-</span>
        <input
          type="text"
          readOnly
          value={format(range[0].endDate, "dd MMM yyyy")}
          onClick={() => setShowPicker(true)}
          className="form-input"
          />
        <button type="button" onClick={() => setShowPicker(!showPicker)}>
          <Calendar className="w-5 h-5" />
        </button>
      </div>
      {showPicker && (
        <div
          className="absolute bg-white shadow-lg p-2 rounded mt-2 z-10"
          ref={pickerRef}
        >
          <DateRange
  ranges={range}
  onChange={(item) => {
    setRange([item.selection]);
    setFromDate(format(item.selection.startDate, "yyyy-MM-dd"));
    setToDate(format(item.selection.endDate, "yyyy-MM-dd"));
    setShowPicker(false);
  }}
  months={2}
  direction="horizontal"
/>

        </div>
      )}

  
    </div>


</div>
      <div className="mb-4">
        <p className="text-sm text-blue-500">{`Applying for ${leaveDays} Day(s) Leave`}</p>
      </div>

      <div className="mb-4">
      <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
      <textarea className="form-input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter your reason" />
      </div>

      {isFileUploadVisible && (
        <div className="mb-4">
    <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Upload File *</label>
    <input type="file" className="w-full p-2 form-input " onChange={handleFileChange} />
        </div>
      )}

      <div className="flex space-x-4">
        <button onClick={handleApply} className="btn btn-primary !mt-6">Apply</button>
        <button onClick={handleReset} className="btn btn-secondary !mt-6">Reset</button>
      </div>
      </div> 
    </div>
  );
};

export default LeaveForm;
