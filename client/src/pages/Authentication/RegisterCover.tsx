import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Swal from 'sweetalert2';
import { IRootState } from '../../store';
import { userService } from '../../services/userService';

const RegisterCover = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Register'));
    }, [dispatch]);

    const [credentials, setCredentials] = useState({
        name: '',
        organization: '',
        mobile: '',
        email: '',
        password: '',
        adminUsername: '',
        adminPassword: '',
        numberOfUsers: '',
    });
    const [logo, setLogo] = useState<File | null>(null);
    const [customerId, setCustomerId] = useState<any>(null);
    const [errors, setErrors] = useState({
        name: '',
        organization: '',
        mobile: '',
        email: '',
        password: '',
        adminUsername: '',
        adminPassword: '',
        numberOfUsers: '',
        logo: '',
    });
    const [loader, setLoader] = useState(false);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const [flag, setFlag] = useState(themeConfig.locale);

    const setLocale = (flag: string) => {
        setFlag(flag);
        dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
    };

    const validate = () => {
        const errors: any = {};
        const mobilePattern = /^[6-9]\d{9}$/; // Indian mobile number validation pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const numberPattern = /^\d+$/; // Validate that numberOfUsers is an integer

        if (!credentials.name) errors.name = 'Name is required';
        if (!credentials.organization) errors.organization = 'Organization is required';
        if (!credentials.mobile) {
            errors.mobile = 'Mobile is required';
        } else if (!mobilePattern.test(credentials.mobile)) {
            errors.mobile = 'Invalid mobile number';
        }
        if (!credentials.email) {
            errors.email = 'Email is required';
        } else if (!emailPattern.test(credentials.email)) {
            errors.email = 'Invalid email address';
        }
        if (!credentials.password) errors.password = 'Password is required';
        if (!credentials.adminUsername) errors.adminUsername = 'Administrator username is required';
        if (!credentials.adminPassword) errors.adminPassword = 'Administrator password is required';
        if (!credentials.numberOfUsers) {
            errors.numberOfUsers = 'Number of users is required';
        } else if (!numberPattern.test(credentials.numberOfUsers)) {
            errors.numberOfUsers = 'Number of users must be a valid number';
        }
        // if (!logo) {
        //     errors.logo = 'Logo is required';
        // } else if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(logo.type)) {
        //     errors.logo = 'Only image files (jpg, png, gif, svg) are allowed';
        // }
        return errors;
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    logo: 'Only image files (jpg, png, gif, svg) are allowed',
                }));
            } else {
                setLogo(file);
                setErrors((prevErrors) => ({ ...prevErrors, logo: '' }));
            }
        }
    };

    const submitForm = async (e: any) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setLoader(true);

        try {
            const response = await userService.register(credentials);

            Swal.fire({
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: { popup: 'color-green' },
                title: response.message,
            });
            setCustomerId(response.data.customerId);
        } catch (error: any) {
            Swal.fire({
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: { popup: 'color-danger' },
                title: error.response?.data?.message || 'An error occurred',
            });
        } finally {
            setLoader(false);
            setCredentials({
                name: '',
                organization: '',
                mobile: '',
                email: '',
                password: '',
                adminUsername: '',
                adminPassword: '',
                numberOfUsers: '',
            });
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[500px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(15,41,65)_0%,rgba(15,41,65)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10">
                                <img src="/assets/images/auth/logo-white.png" alt="Logo" className="w-full" />
                            </Link>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="w-full max-w-[440px]">
                            <h3 className="text-xl mb-2 font-extrabold  uppercase leading-snug text-sky-700 md:text-3xl">Sign Up</h3>
                            {customerId && (
                                <h6 className="text-sm font-extrabold uppercase mb-2 mt-2 leading-snug text-black md:text-xl">
                                    Your customer id is : <span className='bolder text-primary'>{customerId}</span>
                                </h6>
                            )}
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                            <div className="relative text-white-dark">
                                    <input
                                        id="adminUsername"
                                        type="text"
                                        value={credentials.adminUsername}
                                        onChange={(e) => setCredentials({ ...credentials, adminUsername: e.target.value })}
                                        placeholder="Enter Administrator Username"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.adminUsername && <p className="text-red-500 text-sm">{errors.adminUsername}</p>}
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="adminPassword"
                                        type="password"
                                        value={credentials.adminPassword}
                                        onChange={(e) => setCredentials({ ...credentials, adminPassword: e.target.value })}
                                        placeholder="Enter Administrator Password"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.adminPassword && <p className="text-red-500 text-sm">{errors.adminPassword}</p>}
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="name"
                                        type="text"
                                        value={credentials.name}
                                        onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                                        placeholder="Enter Name"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="organization"
                                        type="text"
                                        value={credentials.organization}
                                        onChange={(e) => setCredentials({ ...credentials, organization: e.target.value })}
                                        placeholder="Enter Organization"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.organization && <p className="text-red-500 text-sm">{errors.organization}</p>}
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="mobile"
                                        type="text"
                                        value={credentials.mobile}
                                        onChange={(e) => setCredentials({ ...credentials, mobile: e.target.value })}
                                        placeholder="Enter Mobile"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="email"
                                        type="email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        placeholder="Enter Email"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <div className="relative text-white-dark">
                                    <input
                                        id="password"
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        placeholder="Enter Password"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                </div>
                               
                                <div className="relative text-white-dark">
                                    <input
                                        id="numberOfUsers"
                                        type="number"
                                        value={credentials.numberOfUsers}
                                        onChange={(e) => setCredentials({ ...credentials, numberOfUsers: e.target.value })}
                                        placeholder="Enter Number of Users"
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.numberOfUsers && <p className="text-red-500 text-sm">{errors.numberOfUsers}</p>}
                                </div>
                                {/* <div className="relative text-white-dark">
                                    <input
                                        id="logo"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.gif,.svg"
                                        onChange={handleLogoChange}
                                        className="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
                                </div> */}
                                <button
                                    type="submit"
                                    disabled={loader}
                                    className={` btn bg-gradient-to-r   !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${loader ? 'bg-gray-400' : 'from-sky-700 from-10% via-sky-600 via-30% to-orange-500 to-90% text-white '}`}
                                >
                                    {loader ? 'Processing...' : 'Register'}
                                </button>
                                <p className="text-sm flex justify-center text-gray-500">
                                    Already have an account? <Link to="/auth/login" className="text-sky-500 font-bold">Login</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCover;
