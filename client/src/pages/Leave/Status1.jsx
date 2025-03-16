import React, { useEffect, useState } from "react";
import { Avatar, Container, Button } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { ActionIcon } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Link } from 'react-router-dom';



const LeaveStatusTable = () => {
  const [leaveData, setLeaveData] = useState([]);
    const [userData, setUserData] = useState(null);
      const [isAdminMode, setIsAdminMode] = useState(false);
    
  
    useEffect(() => {
      const storedUserData = sessionStorage.getItem('user');
      if (storedUserData) {
        const userDetails = JSON.parse(storedUserData);
        setUserData(userDetails);
        setIsAdminMode(userDetails.role_lpm === "Admin");
      }
    }, []);

  useEffect(() => {
    fetch("http://localhost:3700/leave-s/get-all-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.response === "Success") {
          setLeaveData(data.LeaveApplications);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <Container>
           <div className="relative flex items-center mb-10">
              <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                  <Link to="#" className="text-primary hover:underline">
                    Leave
                  </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                  <span>Status</span>
                </li>
                <li>
                {userData ? (
              <div className="text-sm text-gray-700 mb-4"> 
                {/* <p className="inline-block px-2 py-1 m-2 rounded-md">User: "{userData.name}"</p>
                <p className="inline-block px-2 py-1 m-2 rounded-md">User ID: {userData.userid}</p> */}
                <span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
              User: {userData.name}, {userData.role_lpm}
            </span>
              </div>
            ) : 
            <span className="text-md bg-success-light rounded text-success px-1 ml-0 ltr:ml-2 rtl:ml-2">
              {"Sample User, Admin"}
            </span>
            }
                </li>
              </ul>
              <h2 className="absolute inset-x-0 text-xl font-bold text-center">Leave Status testing new db table</h2>
            </div>
      <DataTable
        striped
        highlightOnHover
        withBorder
        records={leaveData}
        columns={[
          { accessor: "id", title: "ID", textAlign: "center" },
          
{
  accessor: "actions",
  title: "Actions",
  textAlign: "center",
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <ActionIcon variant="transparent">
        <IconCheck size={20} color="green" />
      </ActionIcon>
      <ActionIcon variant="transparent">
        <IconX size={20} color="red" />
      </ActionIcon>
    </div>
  ),
},
          { accessor: "user_name", title: "User" },
          {
            accessor: "profile_picture",
            title: "Profile",
            render: ({ profile_picture, user_name }) => (
              <Avatar src={`http://localhost:3700/uploads/${profile_picture}`} alt={user_name} size="sm" />
            ),
          },
          { accessor: "leave_type_id", title: "Leave Type" },
          {
            accessor: "from_date",
            title: "From",
            render: ({ from_date }) => new Date(from_date).toLocaleDateString(),
          },
          {
            accessor: "to_date",
            title: "To",
            render: ({ to_date }) => new Date(to_date).toLocaleDateString(),
          },
          { accessor: "leave_days", title: "Days", textAlign: "center" },
          { accessor: "reason", title: "Reason" },
          { accessor: "status", title: "Status" },
          {
            accessor: "requested_date",
            title: "Requested Date",
            render: ({ requested_date }) => new Date(requested_date).toLocaleDateString(),
          },
          { accessor: "reject_reason", title: "Reject Reason", render: ({ reject_reason }) => reject_reason || "N/A" },
          {
            accessor: "file",
            title: "File",
            render: ({ file }) =>
              file ? (
                <a href={`http://localhost:3700/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              ) : (
                "N/A"
              ),
          },
          { accessor: "approved_by", title: "Approved By" },
          {
            accessor: "approved_date",
            title: "Approved Date",
            render: ({ approved_date }) => (approved_date ? new Date(approved_date).toLocaleDateString() : "N/A"),
          },
          { accessor: "remarks", title: "Remarks" },
          
          
          
        ]}
      />
    </Container>
  );
};

export default LeaveStatusTable;
