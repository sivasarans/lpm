import { useEffect, useMemo, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { parse } from 'cookie';
import Swal from 'sweetalert2';
import { Link, NavLink, useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
interface FormData {
    name: string;
    email_id: string;
    password: string;
    role_id: string;
    mobile: number | '',
    validityyn: string,
    validtill: Date | '',
    status: number|string,
}
const Edit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [validity, setValidity] = useState<any>('');
    const { id } = useParams();
    const [show, setShow] = useState<any>(0);
    const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    useEffect(() => {
        if(!userAuthDetail.token || role =='Manage'){
            navigate('/auth/login');
        }
    }, [userAuthDetail]);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email_id: '',
        password: '',
        role_id: '',
        mobile: '',
        validityyn: 'N',
        validtill: '',
        status: 0,

    });
    const GetUser = async () => {
        try {
            const response = await userService.getAdmin(id);
            const user = response.UserDetails;
            setFormData({
                name: user.username,
                email_id: user.email,
                password: '',
                role_id: user.role,
                mobile: user.mobile,
                validityyn: user.validityyn,
                validtill: user.validtill,
                status: user.active,

            });
            if (user.validityyn == 'Y') setShow(1);
            else setShow(0);
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    useEffect(() => {
        dispatch(setPageTitle('Edit User'));
        GetUser();
    }, []);
    const toggleShow = (e:any) => {
        if (e.target.checked) {
            setFormData(prevFormData => ({ ...prevFormData, validityyn: 'Y', validtill: '', }));
            setShow(1);
        } else {
            setShow(0);
            setFormData(prevFormData => ({ ...prevFormData, validityyn: 'N', validtill: '', }));
            setValidity('');
        }
    };
    const [loader, setLoader] = useState(false);
    const toggleStatusShow = (e: any) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            status: e.target.checked ? 1 : 0
        }));
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            // Perform any additional validation if needed

            // Send the form data to the API
            const response = await userService.updateAdmin(formData, id);

            // Handle the API response as needed
            if (response.response == 'Success') {
                // Form submission successful
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-success`,
                    },
                });
                toast.fire({
                    title: 'User Updated Successfullly',
                });
                setFormData({
                    name: '',
                    email_id: '',
                    password: '',
                    role_id: '',
                    mobile: '',
                    validityyn: '',
                    validtill: '',
                    status: 1
                });
                navigate('/users');
            } else {
                // Form submission failed
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-danger`,
                    },
                });
                toast.fire({
                    title: response.data.message,
                });
            }
        } catch (error: any) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: {
                    popup: `color-danger`,
                },
            });
            toast.fire({
                title: error.message,
            });
        } finally {
            setLoader(false);
        }
    };
    const memoizedFormData = useMemo(() => formData, [formData]);
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Update</span>
                </li>
            </ul>

            <div className="pt-5 grid  grid-cols-1 gap-6">



                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Edit User</h5>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="username">Username *</label>
                                    <input name="username" type="text" placeholder="Enter Username *" className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email_id">Email *</label>
                                    <input name="email_id" type="email"
                                        placeholder="Enter Email *" className="form-input"
                                        value={formData.email_id}
                                        onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password">Password *</label>
                                    <input name="password" type="password" placeholder="Enter Password *" className="form-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="role_id">Role *</label>
                                    <select name="role_id"
                                        value={formData.role_id}
                                        onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                        className="form-select">
                                        <option value=" ">Choose Role</option>
                                        <option value="Manage">Manage</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="mobile">Mobile *</label>
                                    <input name="mobile" type="number" placeholder="Enter Mobile *" className="form-input"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="role_id">Status *</label>
                                    <select name="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="form-select">
                                        <option value="1">Active</option>
                                        <option value="0">In-active</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="validityCheckbox" className="flex items-center mt-1 cursor-pointer">
                                        <input
                                            id="validityCheckbox"
                                            onChange={toggleShow}
                                            checked={formData.validityyn === 'Y'}
                                            type="checkbox"
                                            className="form-checkbox"
                                        />
                                        <span className="text-white-dark">Validity</span>
                                    </label>
                                </div>
                                {(show === 1) && (
                                    <div>
                                        <label htmlFor="validityDate">Validity Till</label>
                                        <Flatpickr
                                            value={formData.validtill}
                                            options={{
                                                dateFormat: 'd-m-Y',
                                                position: 'auto left',
                                                minDate: new Date().fp_incr(1)
                                            }}
                                            className="form-input"
                                            onChange={(date: any) => {
                                                setFormData(prevFormData => ({
                                                    ...prevFormData,
                                                    validtill: date[0] ? date[0].toISOString().substring(0, 10) : '' // assuming you want the date in 'YYYY-MM-DD' format
                                                }));
                                            }}
                                        />
                                    </div>
                                )}
                            </div>



                            <button type="submit" className="btn btn-primary !mt-6">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;
