import { useEffect, useState } from 'react';
import { parse } from 'cookie';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { userService } from '../../services/userService';
import { setPageTitle } from '../../store/themeConfigSlice';

interface FormData {
    service: string;
    host: string;
    username: string;
    password: string;
    port: number | '';
}

const MailService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userAuthDetail = JSON.parse(sessionStorage.getItem('user'));
    const role = userAuthDetail?.role?userAuthDetail.role:'Manage';
    const [verify,setVerify] = useState<any>('')
    useEffect(() => {
        if (!userAuthDetail.token) {
            navigate('/auth/login');
        }
    }, [userAuthDetail]);

    const [formData, setFormData] = useState<FormData>({
        service: '',
        host: '',
        username: '',
        password: '',
        port: ''
    });

    const [errors, setErrors] = useState<Partial<FormData>>({}); // Error state for form validation

    const GetService = async () => {
        try {
            const response = await userService.getMailService();
            const service = response.service;
            setFormData({
                service: service.service,
                host: service.host,
                username: service.username,
                password: service.password,
                port: service.port,
            });
            setVerify(service.mail_verified_at);
        } catch (error) {
            return ('Something Went Wrong');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Mail Service'));
        GetService();
    }, []);

    const [loader, setLoader] = useState(false);

    // Validation function
    const validate = () => {
        const newErrors: Partial<FormData> = {};

        if (!formData.service) newErrors.service = 'Service is required';
        if (!formData.host) newErrors.host = 'Host name is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.port || isNaN(Number(formData.port))) newErrors.port = 'Valid port number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validate()) {
            return; // Exit if validation fails
        }

        setLoader(true);
        try {
            const response = await userService.updateMailService(formData);
            Swal.fire({
                title: 'Mail Configured Successfully',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: { popup: 'color-success' },
            });
            setVerify('');
        } catch (error: any) {
            Swal.fire({
                title: error?.response?.data?.message || 'Error occurred',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: { popup: 'color-danger' },
            });
        } finally {
            setLoader(false);
        }
    };

    const handleVerify = async () => {
        if (!validate()) {
            return; // Exit if validation fails
        }
        try {
            const response = await userService.verifyMailService(formData);
            Swal.fire({
                title: response.message || 'Mail Service Verified Successfully',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: { popup: 'color-success' },
            });
            setVerify(true);
        } catch (error: any) {
            Swal.fire({
                title: error?.response?.data?.message || 'Verification Failed',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: { popup: 'color-danger' },
            });
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Mail Service</span>
                </li>
            </ul>

            <div className="pt-5 grid grid-cols-1 gap-6">
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Mail Configuration</h5>
                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="service">Service *</label>
                                    <input
                                        name="service"
                                        type="text"
                                        placeholder="Gmail"
                                        className="form-input"
                                        value={formData.service}
                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    />
                                    {errors.service && <p className="text-red-500">{errors.service}</p>}
                                </div>
                                <div>
                                    <label htmlFor="host">Host Name *</label>
                                    <input
                                        name="host"
                                        type="text"
                                        placeholder="smtp.gmail.com"
                                        className="form-input"
                                        value={formData.host}
                                        onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                                    />
                                    {errors.host && <p className="text-red-500">{errors.host}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="username">Username *</label>
                                    <input
                                        name="username"
                                        type="text"
                                        placeholder="username"
                                        className="form-input"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                    {errors.username && <p className="text-red-500">{errors.username}</p>}
                                </div>
                                <div>
                                    <label htmlFor="password">Password *</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Enter Password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                                </div>
                                <div>
                                    <label htmlFor="port">Port *</label>
                                    <input
                                        name="port"
                                        type="text"
                                        placeholder="Enter port"
                                        className="form-input"
                                        value={formData.port}
                                        onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                                    />
                                    {errors.port && <p className="text-red-500">{errors.port}</p>}
                                </div>
                            </div>

                            <div className="flex space-x-4 !mt-6">
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                                { !verify && (
                                    <button type="button" className="btn btn-secondary" onClick={handleVerify}>
                                    Verify Configuration
                                    </button>
                                ) }
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MailService;
