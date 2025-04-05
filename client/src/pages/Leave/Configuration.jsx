import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveConfigTable = () => {
  const [data, setData] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    axios.get("http://localhost:3700/leave/leave-configuration")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  // Format data: group by role_name
  const grouped = data.reduce((acc, curr) => {
    const { role_name, leave_type_id, leave_settings } = curr;
    if (!acc[role_name]) acc[role_name] = {};
    acc[role_name][leave_type_id] = leave_settings;
    return acc;
  }, {});

  const leaveTypeMap = {
    1: 'EL', 2: 'SL', 3: 'CL', 4: 'CO', 5: 'SO', 6: 'SML', 7: 'ML',
    8: 'CW', 9: 'OOD', 10: 'COL', 11: 'WFH', 12: 'WO', 13: 'MP', 14: 'PL'
  };
  
  const leaveTypeIds = Object.keys(leaveTypeMap).map(Number);
  

  // const leaveTypeIds = Array.from({ length: 11 }, (_, i) => i + 1);

  // Handle cell edit
  const handleChange = (role, typeId, value) => {
    const newValue = Number(value);
    axios.put("http://localhost:3700/leave/leave-configuration", {
      role_name: role,
      leave_type_id: typeId,
      leave_settings: newValue
    }).then(() => {
      setData(prev =>
        prev.map(item =>
          item.role_name === role && item.leave_type_id === typeId
            ? { ...item, leave_settings: newValue }
            : item
        )
      );
    }).catch(console.error);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3">Leave Settings</h2>
      <table className="w-full border border-gray-300 text-sm">
        {/* <thead>
          <tr>
            <th className="border p-2">Role</th>
            {leaveTypeIds.map(id => (
              <th key={id} className="border p-2">LT-{id}</th>
            ))}
          </tr>
        </thead> */}
        <thead>
  <tr>
    <th className="border p-2">Role</th>
    {leaveTypeIds.map(id => (
      <th key={id} className="border p-2">{leaveTypeMap[id]}</th>
    ))}
  </tr>
</thead>

        <tbody>
          {Object.entries(grouped).map(([role, leaves]) => (
            <tr key={role}>
              <td className="border p-2 font-medium">{role}</td>
              {leaveTypeIds.map(id => (
                <td key={id} className="border p-1 text-center">
                  <input
                    type="number"
                    className="w-14 border rounded px-1"
                    value={leaves[id] ?? 0}
                    onChange={(e) => handleChange(role, id, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveConfigTable;
