import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { contactService } from '../../services/contactService';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';
import { formatDate } from 'date-fns';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { parse } from 'cookie';

const Salutations = () => {
    const [editRowId, setEditRowId] = useState<number | null>(null);
    const [value, setValue] = useState<string>('');
    const [users, setUsers] = useState<any>([]);
    const [user, setUser] = useState<any>(0);
    const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    const GetUsers = async () => {
        try {
            const response = await userService.getAdmins();
            setUsers(response.UserDetails);
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    const dispatch = useDispatch();
    const [items, setItems] = useState([
        {
            id: 0,
            username: '',
            name: '',
            salutation: '',
            organization: '',
            job_title: '',
            email1: '',
            mobile1: '',
            type: '',
            status: 0,
        },
    ]);

    const GetSalutations = async (id:any) => {
        try {
            const response = await contactService.getSalutations(id);
            setItems(response.salutations);
        } catch (error) {
            return 'Something Went Wrong';
        }
    };
   
    useEffect(() => {
        dispatch(setPageTitle('User Salutations'));
        GetSalutations(0);
        GetUsers();
    }, []);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'id'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'name',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
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
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.organization.toLowerCase().includes(search.toLowerCase()) ||
                    item.email1.toLowerCase().includes(search.toLowerCase()) ||
                    item.mobile1.toLowerCase().includes(search.toLowerCase()) ||
                    item.username.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [items, search]);

    useEffect(() => {
        const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
        setPage(1);
    }, [sortStatus]);

    const handleEditClick = (event, row) => {
        event.preventDefault();
        setEditRowId(row.id);
        setValue(row.salutation);
    };

    const handleCancelClick = () => {
        setEditRowId(null);
    };

    const handleSaveClick = async (event, row) => {
        event.preventDefault();
        try {
            const data = {
                'contact_id': row.id,
                'salutation': value,
                'user_id': row.userid
            }
            await contactService.updateSalutations(data); // Assuming you have an updateSalutation function in your service
            GetSalutations(row.userid);
            setEditRowId(null);
            Swal.fire('Success', 'Salutations added successfully', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to save changes', 'error');
        }
    };
    const handleInputChange = (event) =>{
        setUser(event.target.value);
        GetSalutations(event.target.value);
    }
    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                   {role == 'Admin' && (
                    <div className=" items-center mt-4">
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
                                accessor: 'actions',
                                title: 'Actions',
                                render: (row) => {
                                    return editRowId === row.id ? (
                                        <>
                                            <ul className="flex items-center justify-center gap-2">
                                                <li>
                                                    <Tippy content="Save">
                                                        <button onClick={(event) => handleSaveClick(event, row)} type="button">
                                                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                                <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </button>
                                                    </Tippy>
                                                </li>
                                                <li>
                                                    <Tippy content="Cancel">
                                                        <button onClick={handleCancelClick} type="button">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-danger">
                                                                <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                                <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            </svg>
                                                        </button>
                                                    </Tippy>
                                                </li>
                                            </ul>
                                        </>
                                    ) : (
                                        <button onClick={(event) => handleEditClick(event, row)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5">
                                                <path
                                                    opacity="0.5"
                                                    d="M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                ></path>
                                                <path
                                                    d="M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                                <path
                                                    opacity="0.5"
                                                    d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                            </svg>
                                        </button>
                                    );
                                },
                            },
                            {
                                accessor: 'salutation',
                                sortable: true,
                                render: (row) => {
                                    return editRowId === row.id ? (
                                        <input
                                            className="form-input"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                        />
                                    ) : (
                                        row.salutation
                                    );
                                },
                            },
                            {
                                accessor: 'username',
                                title: 'User',
                                sortable: true,
                                render: ({ username }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{username}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'name',
                                title: 'Contact Name',
                                sortable: true,
                                render: ({ name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'organization',
                                sortable: true,
                                render: ({ organization }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{organization}</div>
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

export default Salutations;
