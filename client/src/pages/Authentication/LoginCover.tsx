import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import i18next from 'i18next';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';
const LoginCover = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login'));
    });
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '', otp: '', token: '', customer_id: '' });
    const [loader, setLoader] = useState(false);
    const [state, setState] = useState({
        loading: false,
        token: null,
        flag: useSelector((state: IRootState) => state.themeConfig.locale),
        selectedOption: 'password',
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);
    const [selectedOption, setSelectedOption] = useState('password');

    const submitForm = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            if (selectedOption == 'otp') {
                if (!credentials.email || !credentials.otp) {
                    // Use a proper UI component for error messages
                    alert('Please provide both email and otp');
                    return;
                }
            } else {
                if (!credentials.email || !credentials.password) {
                    // Use a proper UI component for error messages
                    alert('Please provide both email and password');
                    return;
                }
            }
            let response;
            if (selectedOption == 'otp') {
                response = await userService.otpLogin(credentials);
            } else {
                response = await userService.login(credentials);
            }

            if (response.response == 'Success') {
                // document.cookie = `token=${response.AccessToken};  path=/; max-age=18000;`;
                // document.cookie = `role=${response.data.role};  path=/; max-age=18000;`;
                // document.cookie = `name=${response.data.name};  path=/; max-age=18000;`;
                sessionStorage.setItem('user',JSON.stringify({ name: response.data.name, role: response.data.role, role_lpm: response.data.role_lpm, userid: response.data.id, token:response.AccessToken, mail: response.data.email, }));
                setState((prevState) => ({ ...prevState, loading: true, token: response.AccessToken }));
                navigate('/');
            } else {
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
            // Show error on the UI instead of returning a string
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
                title: error.response.data.message,
            });

        } finally {
            setCredentials({ email: '', password: '', otp: '', token: '', customer_id: '' });
            setLoader(false);
        }


    };
    const sendOtp = async (e: any) => {
        e.preventDefault();
        setLoader(true);

        try {
            if (!credentials.email) {
                // Use a proper UI component for error messages
                alert('Please provide email');
                return;
            }
            const response = await userService.sendOtp(credentials);

            if (response.response == 'Success') {
                setState((prevState) => ({ ...prevState, loading: true, token: response.tokenKey }));
                setCredentials({ ...credentials, token: response.tokenKey })
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
                    title: response.message,
                });
            } else {
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
                    title: response.message,
                });
            }

        } catch (error: any) {
            // Show error on the UI instead of returning a string
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
                title: error.response.data.message,
            });

        } finally {

            setState((prevState) => ({ ...prevState, loading: false, token: null }));
            setLoader(false);
        }
    }

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
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
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="w-8 block lg:hidden">
                                <img src="/assets/images/auth/logo-white.png" alt="Logo" className="mx-auto w-10" />
                            </Link>

                        </div>
                        <div className="w-full max-w-[440px] ">
                            <div className="">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-sky-700 md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal mb-10 text-white-dark">Enter your OTP or Password to login</p>
                                <div className="flex mb-5">
                                    <button type="button" onClick={() => setSelectedOption('password')} className="btn bg-gradient-to-r from-gray-500 from-10% via-gray-500 via-30% to-gray-500 to-90% text-white mr-2  w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        Password
                                    </button>
                                    <button type="button" onClick={() => setSelectedOption('otp')} className="btn bg-gradient-to-r from-gray-500 from-10% via-gray-500 via-30% to-gray-500 to-90% text-white  w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        OTP
                                    </button>
                                </div>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>

                                <div>
                                    {/* <label htmlFor="Email">Customer Id</label>
                                    <div className="relative text-white-dark">
                                        <input id="CustomerId" type="text" value={credentials.customer_id}
                                            onChange={(e) => setCredentials({ ...credentials, customer_id: e.target.value })} placeholder="Enter Customer Id" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path
                                                    opacity="0.5"
                                                    d="M10.65 2.25H7.35C4.23873 2.25 2.6831 2.25 1.71655 3.23851C0.75 4.22703 0.75 5.81802 0.75 9C0.75 12.182 0.75 13.773 1.71655 14.7615C2.6831 15.75 4.23873 15.75 7.35 15.75H10.65C13.7613 15.75 15.3169 15.75 16.2835 14.7615C17.25 13.773 17.25 12.182 17.25 9C17.25 5.81802 17.25 4.22703 16.2835 3.23851C15.3169 2.25 13.7613 2.25 10.65 2.25Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M14.3465 6.02574C14.609 5.80698 14.6445 5.41681 14.4257 5.15429C14.207 4.89177 13.8168 4.8563 13.5543 5.07507L11.7732 6.55931C11.0035 7.20072 10.4691 7.6446 10.018 7.93476C9.58125 8.21564 9.28509 8.30993 9.00041 8.30993C8.71572 8.30993 8.41956 8.21564 7.98284 7.93476C7.53168 7.6446 6.9973 7.20072 6.22761 6.55931L4.44652 5.07507C4.184 4.8563 3.79384 4.89177 3.57507 5.15429C3.3563 5.41681 3.39177 5.80698 3.65429 6.02574L5.4664 7.53583C6.19764 8.14522 6.79033 8.63914 7.31343 8.97558C7.85834 9.32604 8.38902 9.54743 9.00041 9.54743C9.6118 9.54743 10.1425 9.32604 10.6874 8.97558C11.2105 8.63914 11.8032 8.14522 12.5344 7.53582L14.3465 6.02574Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                    </div> */}
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="Email" type="email" value={credentials.email}
                                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path
                                                    opacity="0.5"
                                                    d="M10.65 2.25H7.35C4.23873 2.25 2.6831 2.25 1.71655 3.23851C0.75 4.22703 0.75 5.81802 0.75 9C0.75 12.182 0.75 13.773 1.71655 14.7615C2.6831 15.75 4.23873 15.75 7.35 15.75H10.65C13.7613 15.75 15.3169 15.75 16.2835 14.7615C17.25 13.773 17.25 12.182 17.25 9C17.25 5.81802 17.25 4.22703 16.2835 3.23851C15.3169 2.25 13.7613 2.25 10.65 2.25Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M14.3465 6.02574C14.609 5.80698 14.6445 5.41681 14.4257 5.15429C14.207 4.89177 13.8168 4.8563 13.5543 5.07507L11.7732 6.55931C11.0035 7.20072 10.4691 7.6446 10.018 7.93476C9.58125 8.21564 9.28509 8.30993 9.00041 8.30993C8.71572 8.30993 8.41956 8.21564 7.98284 7.93476C7.53168 7.6446 6.9973 7.20072 6.22761 6.55931L4.44652 5.07507C4.184 4.8563 3.79384 4.89177 3.57507 5.15429C3.3563 5.41681 3.39177 5.80698 3.65429 6.02574L5.4664 7.53583C6.19764 8.14522 6.79033 8.63914 7.31343 8.97558C7.85834 9.32604 8.38902 9.54743 9.00041 9.54743C9.6118 9.54743 10.1425 9.32604 10.6874 8.97558C11.2105 8.63914 11.8032 8.14522 12.5344 7.53582L14.3465 6.02574Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                    {selectedOption === 'otp' && (
                                        <div className={loader ? 'pointer-events-none opacity-50' : ''} onClick={sendOtp}>
                                            <span className=" float-right font-bold mr-1 mt-1 text-sky-900 cursor-pointer items-right">Get OTP</span>
                                        </div>
                                    )}

                                </div>
                                {selectedOption === 'password' && (
                                    <div>
                                        <label htmlFor="Password">Password</label>
                                        <div className="relative text-white-dark">
                                            <input id="Password" type="password" value={credentials.password}
                                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path
                                                        opacity="0.5"
                                                        d="M1.5 12C1.5 9.87868 1.5 8.81802 2.15901 8.15901C2.81802 7.5 3.87868 7.5 6 7.5H12C14.1213 7.5 15.182 7.5 15.841 8.15901C16.5 8.81802 16.5 9.87868 16.5 12C16.5 14.1213 16.5 15.182 15.841 15.841C15.182 16.5 14.1213 16.5 12 16.5H6C3.87868 16.5 2.81802 16.5 2.15901 15.841C1.5 15.182 1.5 14.1213 1.5 12Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M6 12.75C6.41421 12.75 6.75 12.4142 6.75 12C6.75 11.5858 6.41421 11.25 6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M12.75 12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C12.4142 11.25 12.75 11.5858 12.75 12Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M5.0625 6C5.0625 3.82538 6.82538 2.0625 9 2.0625C11.1746 2.0625 12.9375 3.82538 12.9375 6V7.50268C13.363 7.50665 13.7351 7.51651 14.0625 7.54096V6C14.0625 3.20406 11.7959 0.9375 9 0.9375C6.20406 0.9375 3.9375 3.20406 3.9375 6V7.54096C4.26488 7.51651 4.63698 7.50665 5.0625 7.50268V6Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {selectedOption === 'otp' && (
                                    <div>
                                        <label htmlFor="otp">OTP</label>
                                        <div className="relative text-white-dark">
                                            <input id="otp" type="text" value={credentials.otp}
                                                onChange={(e) => setCredentials({ ...credentials, otp: e.target.value })} placeholder="Enter OTP" className="form-input ps-10 placeholder:text-white-dark" />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path
                                                        opacity="0.5"
                                                        d="M1.5 12C1.5 9.87868 1.5 8.81802 2.15901 8.15901C2.81802 7.5 3.87868 7.5 6 7.5H12C14.1213 7.5 15.182 7.5 15.841 8.15901C16.5 8.81802 16.5 9.87868 16.5 12C16.5 14.1213 16.5 15.182 15.841 15.841C15.182 16.5 14.1213 16.5 12 16.5H6C3.87868 16.5 2.81802 16.5 2.15901 15.841C1.5 15.182 1.5 14.1213 1.5 12Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M6 12.75C6.41421 12.75 6.75 12.4142 6.75 12C6.75 11.5858 6.41421 11.25 6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M12.75 12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C12.4142 11.25 12.75 11.5858 12.75 12Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M5.0625 6C5.0625 3.82538 6.82538 2.0625 9 2.0625C11.1746 2.0625 12.9375 3.82538 12.9375 6V7.50268C13.363 7.50665 13.7351 7.51651 14.0625 7.54096V6C14.0625 3.20406 11.7959 0.9375 9 0.9375C6.20406 0.9375 3.9375 3.20406 3.9375 6V7.54096C4.26488 7.51651 4.63698 7.50665 5.0625 7.50268V6Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className='flex justify-between'>
                                    <span>
                                        {selectedOption === 'password' && (
                                            <Link to="/auth/password-reset" className="">
                                                <label className="flex cursor-pointer items-center">
                                                    <span className="text-sky-400 font-bold">Forgot Password</span>
                                                </label>
                                            </Link>
                                        )}
                                    </span>

                                    <Link to="/auth/register" className="">
                                        <label className="flex cursor-pointer items-center">
                                            <span className="text-orange-400 font-bold">Register</span>
                                        </label>
                                    </Link>
                                </div>



                                <div className="flex">
                                    <button type="submit" disabled={loader} className="btn bg-gradient-to-r from-sky-700 from-10% via-sky-600 via-30% to-orange-500 to-90% text-white  !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        {loader && (
                                            <span className="animate-ping w-3 h-3 ltr:mr-4 rtl:ml-4 inline-block rounded-full bg-white"></span>
                                        )}
                                        Sign in
                                    </button>

                                </div>
                            </form>



                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCover;
