import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { contactService } from '../../services/contactService';
import { userService } from '../../services/userService';
import moment from 'moment';
import { parse } from 'cookie';
const Logs = () => {
    const dispatch = useDispatch();
    const [loader,setLoader] = useState(false);

    const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';

    const [items, setItems] = useState([
          {
            "error": 0,
            "id": 0,
            "name": "",
            "organization": "",
            "job_title": "",
            "email1": "",
            "mobile1": "",
            "type": "",
            "validation_errors": "",
            'status': 0,
            
          }
    ]);
    const [users, setUsers] = useState<any>([]);
    const [user, setUser] = useState<any>(0);
    const GetUsers = async () => {
        try {
            const response = await userService.getAdmins();
            setUsers(response.UserDetails);
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    const GetLogs = async (id:any) => {
        try {
            const response = await contactService.getLogs(id);
            setItems(response.logs);
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    useEffect(() => {
        dispatch(setPageTitle('Log List'));
        GetUsers();
        GetLogs(0);
    },[]);
   

   
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'id'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'desc',
    });

    useEffect(() => {
        setPage(1);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return items.filter((item) => {
                return (
                    item.email1.toLowerCase().includes(search.toLowerCase()) 
                );
            });
        });
    }, [items,search]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);
    const handleInputChange = (event:any) =>{
        setUser(event.target.value);
        GetLogs(event.target.value);
    }

    const handleExport = async () => {
        try {
            setLoader(true);
            const response = await contactService.exportLogs(user);    
            if (response) {
                const blob = new Blob([response], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'failedContacts.csv'; // or use a different file name
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Unexpected response structure:', response);
                alert('Failed to export logs.');
            }
        } catch (error) {
            if(error.response.data.message){
                alert(error.response.data.message);
            }else{
                alert(error?.message);
            }
        } finally {
            setLoader(false);
        }
    };
    const handleClear = async () => {
        try {
            setLoader(true);
            const response = await contactService.clearAll(user);    
            if (response && response.response =='Success') {
                alert('Record Deleted Successfully');
            } else {
                alert('Failed to clear data.');
            }
            GetLogs(0);
        } catch (error) {
            if(error.response.data.message){
                alert(error.response.data.message);
            }else{
                alert(error?.message);
            }
        } finally {
            setLoader(false);
        }
    };
    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                <button type="button" disabled={loader} className="btn btn-danger gap-2" onClick={() => handleClear()}>
                           
                           {loader ?
                                                           <svg
                                                               viewBox="0 0 24 24"
                                                               width="24"
                                                               height="24"
                                                               stroke="currentColor"
                                                               strokeWidth="1.5"
                                                               fill="none"
                                                               strokeLinecap="round"
                                                               strokeLinejoin="round"
                                                               className="w-5 h-5 animate-[spin_2s_linear_infinite] inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0"
                                                           >
                                                               <line x1="12" y1="2" x2="12" y2="6"></line>
                                                               <line x1="12" y1="18" x2="12" y2="22"></line>
                                                               <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                                               <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                                               <line x1="2" y1="12" x2="6" y2="12"></line>
                                                               <line x1="18" y1="12" x2="22" y2="12"></line>
                                                               <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                                               <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                                           </svg>
                                                           :
                                                           null
                                                       } Clear All
                           </button>
                <button type="button" disabled={loader} className="btn btn-success gap-2" onClick={() => handleExport()}>
                           
                           {loader ?
                                                           <svg
                                                               viewBox="0 0 24 24"
                                                               width="24"
                                                               height="24"
                                                               stroke="currentColor"
                                                               strokeWidth="1.5"
                                                               fill="none"
                                                               strokeLinecap="round"
                                                               strokeLinejoin="round"
                                                               className="w-5 h-5 animate-[spin_2s_linear_infinite] inline-block align-middle ltr:mr-2 rtl:ml-2 shrink-0"
                                                           >
                                                               <line x1="12" y1="2" x2="12" y2="6"></line>
                                                               <line x1="12" y1="18" x2="12" y2="22"></line>
                                                               <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                                               <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                                               <line x1="2" y1="12" x2="6" y2="12"></line>
                                                               <line x1="18" y1="12" x2="22" y2="12"></line>
                                                               <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                                               <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                                           </svg>
                                                           :
                                                           null
                                                       } Export
                           </button>

                    {role == 'Admin' && (
                        <div className=" items-center ">
                                <select id="users" name="users" value={user} onChange={(value) => handleInputChange(value)}  className="form-select w-64  mt-2 flex-1">
                                <option  value='0'>Choose</option>
                                    {users.length > 0 && users.map((user, index) => (
                                        <option  value={user.userid}>{user.username}</option>
                                    ))}
                                </select>
                        </div>
                    )}
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        withColumnBorders
                        borderColor="#d0d4da"
                        rowBorderColor="#d0d4da"
                        records={records}
                        columns={[
                            {
                                accessor: 'validation_errors',
                                title:'Errors',
                                sortable: true,
                                width: 150,
                                // 👇 truncate with ellipsis if text overflows the available width
                                ellipsis: true,
                                render: ({ validation_errors, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{validation_errors}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'name',
                                sortable: true,
                                render: ({ name, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'organization',
                                sortable: true,
                                render: ({ organization, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{organization}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'job_title',
                                sortable: true,
                                render: ({ job_title, id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{job_title}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'email1',
                                sortable: true,
                            },
                            {
                                accessor: 'mobile1',
                                sortable: true,
                            },
                            {
                                accessor: 'type',
                                sortable: true,
                                titleClassName: 'text-right',
                                render: ({ type, id }) => <div className="text-right font-semibold">{`${type}`}</div>,
                            },
                            {
                                accessor: 'status',
                                sortable: true,
                                render: ({ status }) => <span className={`badge badge-outline-${status==1?'success':'danger'} `}>{status==1?'Active':'Inactive'}</span>,
                            },
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default Logs;
