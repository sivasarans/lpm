import React, { useState, useEffect } from "react";

const LeaveForm = () => {
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [isFileUploadVisible, setIsFileUploadVisible] = useState(false);

  const [leaveType, setLeaveType] = useState("EL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("Enter reason");
  const [leaveDays, setLeaveDays] = useState(1);
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });

  useEffect(() => {
    const today = new Date();
    setFromDate(today.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = JSON.parse(localStorage.getItem('userDetails'));
      if (storedUserData) setUserData(storedUserData);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      const days = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) + 1;
      setLeaveDays(days);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    if (
      leaveType === "ML" || 
      leaveType === "ml" || 
      leaveType === "SML" || 
      leaveType === "pl" || 
      leaveType === "PL" || 
      leaveType === "sml"
    ) {
      setIsFileUploadVisible(true);
    } else {
      setIsFileUploadVisible(false);
    }
  }, [leaveType]);

  const handleApply = () => {
    console.log("Applying leave with type:", leaveType);
    if (!fromDate || !toDate || !leaveType || !reason || leaveDays <= 0) {
      setAlertMessage({ message: 'All fields are required with valid inputs!', type: 'error' });
      return;
    }

    // Mock applying leave process
    setAlertMessage({ message: 'Leave application submitted successfully!', type: 'success' });
    handleReset();
  };

  useEffect(() => {
    if (alertMessage.message) {
      const timer = setTimeout(() => setAlertMessage({ message: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleReset = () => {
    setLeaveType("EL");
    setFromDate(toDate);
    setReason("Enter reason");
    setLeaveDays(1);
    setFile(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      {alertMessage.message && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md w-80 text-center ${alertMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alertMessage.message}
        </div>
      )}
      <h2 className="text-xl font-bold text-orange-500 text-center mb-6">Apply Leave</h2>

      {userData ? (
        <div className="text-sm text-gray-700 mb-4">
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">User: "{userData.name}"</p>
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">User ID: {userData.user_id}</p>
        </div>
      ) : <p>Loading user data...</p>}

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Leave Type</label>
        <select className="w-full p-2 border border-gray-300 rounded-md" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
          {["EL", "SL", "CL", "CO", "SO", "SML", "ML", "CW", "OOD", "COL", "WFH", "WO", "MP", "PL"].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">From</label>
        <input type="date" className="w-full p-2 border border-gray-300 rounded-md" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">To</label>
        <input type="date" className="w-full p-2 border border-gray-300 rounded-md" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      <div className="mb-4">
        <p className="text-sm text-blue-500">{`Applying for ${leaveDays} Day(s) Leave`}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Reason</label>
        <textarea className="w-full p-2 border border-gray-300 rounded-md" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter your reason" />
      </div>

      {isFileUploadVisible && (
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Upload File</label>
          <input type="file" className="w-full p-2 border border-gray-300 rounded-md" onChange={handleFileChange} />
        </div>
      )}

      <div className="flex space-x-4">
        <button onClick={handleApply} className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Apply</button>
        <button onClick={handleReset} className="w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500">Reset</button>
      </div>
    </div>
  );
};

export default LeaveForm;