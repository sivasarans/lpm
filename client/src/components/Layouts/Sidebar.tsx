import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { parse } from 'cookie';
const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    // const cookies = parse(document.cookie);
    const user = JSON.parse(sessionStorage.getItem('user'));
    const role = user?.role?user.role:'Manage';
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ml-[5px] flex-none" src="/assets/images/logo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('LPMS-Test Mode')}</span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 m-auto">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <li className="nav-item">
                                <NavLink to="/" className="group">
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Dashboard')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <svg className="w-4 h-5 flex-none hidden" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>{t('apps')}</span>
                            </h2>
                            { role=='Admin' && (
                            <>
                            <li className="nav-item">
                                <NavLink to="/users" className="group">
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="15" cy="6" r="3" fill="currentColor" />
                                            <ellipse opacity="0.5" cx="16" cy="17" rx="5" ry="3" fill="currentColor" />
                                            <circle cx="9.00098" cy="6" r="4" fill="currentColor" />
                                            <ellipse cx="9.00098" cy="17.001" rx="7" ry="4" fill="currentColor" />
                                        </svg>
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('users')}</span>
                                    </div>
                                </NavLink>
                            </li>

                           
                            </>
                            
                            
                            ) }
                                                        
                          
<li className="menu nav-item">
    <button
        type="button"
        className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`}
        onClick={() => toggleMenu('dashboard')}
    >
        <div className="flex items-center">
            <svg
                className="group-hover:!text-primary shrink-0"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    opacity="0.5"
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H8V11H16V13Z"
                    fill="currentColor"
                />
            </svg>
            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                {t('Leave')}
            </span>
        </div>

        <div className={currentMenu === 'dashboard' ? 'rotate-90' : 'rtl:rotate-180'}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9 5L15 12L9 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    </button>

    <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
        <ul className="sub-menu text-gray-500">
            <li>
                <NavLink to="/leave/apply">{t('Apply')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/status">{t('Status')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/status1">{t('Status ( testing )')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/chart">{t('Chart')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/chart1">{t('Chart1')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/balance">{t('Balance')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/Calender">{t('Calender')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/assign">{t('Configuration')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/configuration">{t('Configuration Beta')}</NavLink>
            </li>
            <li>
                <NavLink to="/leave/reports">{t('Reports')}</NavLink>
            </li>

        </ul>
    </AnimateHeight>
</li>


<li className="menu nav-item">
    <button
        type="button"
        className={`${currentMenu === 'permission' ? 'active' : ''} nav-link group w-full`}
        onClick={() => toggleMenu('permission')}
    >
        <div className="flex items-center">
            <svg
                className="group-hover:!text-primary shrink-0"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    opacity="0.5"
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H8V11H16V13Z"
                    fill="currentColor"
                />
            </svg>
            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                {t('Permission')}
            </span>
        </div>

        <div className={currentMenu === 'permission' ? 'rotate-90' : 'rtl:rotate-180'}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9 5L15 12L9 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    </button>

    <AnimateHeight duration={300} height={currentMenu === 'permission' ? 'auto' : 0}>
        <ul className="sub-menu text-gray-500">
            <li>
                <NavLink to="/Permission/apply">{t('Apply')}</NavLink>
            </li>
            <li>
                <NavLink to="/Permission/status">{t('Status')}</NavLink>
            </li>
        </ul>
    </AnimateHeight>
</li>     




<li className="menu nav-item">
    <button
        type="button"
        className={`${currentMenu === 'charts' ? 'active' : ''} nav-link group w-full`}
        onClick={() => toggleMenu('charts')}
    >
        <div className="flex items-center">
            <svg
                className="group-hover:!text-primary shrink-0"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    opacity="0.5"
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H8V11H16V13Z"
                    fill="currentColor"
                />
            </svg>
            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                {t('Charts')}
            </span>
        </div>

        <div className={currentMenu === 'charts' ? 'rotate-90' : 'rtl:rotate-180'}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9 5L15 12L9 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    </button>

    <AnimateHeight duration={300} height={currentMenu === 'charts' ? 'auto' : 0}>
        <ul className="sub-menu text-gray-500">
            <li>
                <NavLink to="/charts">{t('charts')}</NavLink>
            </li>
        
        </ul>
    </AnimateHeight>
</li>  

<li className="menu nav-item">
    <button
        type="button"
        className={`${currentMenu === 'calender' ? 'active' : ''} nav-link group w-full`}
        onClick={() => toggleMenu('calender')}
    >
        <div className="flex items-center">
            <svg
                className="group-hover:!text-primary shrink-0"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    opacity="0.5"
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H8V11H16V13Z"
                    fill="currentColor"
                />
            </svg>
            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                {t('Calender')}
            </span>
        </div>

        <div className={currentMenu === 'calender' ? 'rotate-90' : 'rtl:rotate-180'}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9 5L15 12L9 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    </button>

    <AnimateHeight duration={300} height={currentMenu === 'calender' ? 'auto' : 0}>
        <ul className="sub-menu text-gray-500">
            <li>
                <NavLink to="/calender">{t('Calender')}</NavLink>
            </li>

            <li>
                <NavLink to="/calenderBeta">{t('Calender Beta')}</NavLink>
            </li>
        
        </ul>
    </AnimateHeight>
</li> 

<li className="menu nav-item">
    <button
        type="button"
        className={`${currentMenu === 'reports' ? 'active' : ''} nav-link group w-full`}
        onClick={() => toggleMenu('reports')}
    >
        <div className="flex items-center">
            <svg
                className="group-hover:!text-primary shrink-0"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    opacity="0.5"
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H8V11H16V13Z"
                    fill="currentColor"
                />
            </svg>
            <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                {t('Reports')}
            </span>
        </div>

        <div className={currentMenu === 'reports' ? 'rotate-90' : 'rtl:rotate-180'}>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9 5L15 12L9 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    </button>

    <AnimateHeight duration={300} height={currentMenu === 'reports' ? 'auto' : 0}>
        <ul className="sub-menu text-gray-500">
            <li>
                <NavLink to="/reports">{t('reports')}</NavLink>
            </li>
        
        </ul>
    </AnimateHeight>
</li> 




                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
