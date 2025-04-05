import { lazy } from 'react';
import Salutations from '../pages/Users/Salutations';
import MailService from '../pages/Users/MailService';
import RegisterCover from '../pages/Authentication/RegisterCover';

const UserList = lazy(() => import('../pages/Users/List'));
const UserAdd = lazy(() => import('../pages/Users/Add'));
const UserEdit = lazy(() => import('../pages/Users/Edit'));
const ContactList = lazy(() => import('../pages/Contacts/List'));
const ContactAdd = lazy(() => import('../pages/Contacts/Add'));
const ContactEdit = lazy(() => import('../pages/Contacts/Edit'));
const ContactLog = lazy(() => import('../pages/Contacts/Logs'));


const Index = lazy(() => import('../pages/Index'));
const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const Maintenence = lazy(() => import('../pages/Pages/Maintenence'));
const Unlock = lazy(() => import('../pages/Authentication/Unlock'));
const RecoverIdBoxed = lazy(() => import('../pages/Authentication/RecoverIdBox'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const Error = lazy(() => import('../components/Error'));
const LeaveApply = lazy(() => import('../pages/Leave/Apply'));
const LeaveStatus = lazy(() => import('../pages/Leave/Status'));
const LeaveStatus1 = lazy(() => import('../pages/Leave/Status1'));

const LeaveApplyOLD = lazy(() => import('../pages/Leave/Apply_date_range'));

const LeaveBalance = lazy(() => import('../pages/Leave/Balance'));
const LeaveBalance1 = lazy(() => import('../pages/Leave/Balance1'));

const LeaveReports = lazy(() => import('../pages/Leave/Reports'));
const LeaveCalender = lazy(() => import('../pages/Leave/Calendar'));
const LeaveCalenderBeta = lazy(() => import('../pages/Leave/CalendarBeta'));
const LeaveAssign = lazy(() => import('../pages/Leave/Assign'));
const LeaveConfiguration = lazy(() => import('../pages/Leave/Configuration'));


const PermissionApply = lazy(() => import('../pages/Permission/Apply'));
const PermissionStatus = lazy(() => import('../pages/Permission/Status'));
const Date = lazy(() => import('../pages/Leave/Date'));

const Piechart = lazy(() => import('../pages/Leave/Chart'));
const Barchart = lazy(() => import('../pages/Leave/Chart1'));




const routes = [
     //Authentication
    {
        path: '/auth/login',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/leave/apply',
        element: <LeaveApply />,
    },
    {
        path: '/leave/applyold',
        element: <LeaveApplyOLD />,
    },
    {
        path: '/leave/chart',
        element: <Piechart />,
    },
    {
        path: '/leave/chart1',
        element: <Barchart />,
    },
    // {
    //     path: '/charts',
    //     element: <Barchart />,
    // },
    {
        path: '/charts',
        element: (
            <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '10px' }}>
                <Barchart />
                <Piechart />
            </div>
        ),
    },
    
    
    {
        path: '/date',
        element: <Date />,
    },
    {
        path: '/leave/status',
        element: <LeaveStatus />,
    },
    {
        path: '/leave/status1',
        element: <LeaveStatus1 />,
    },
    {
        path: '/leave/reports',
        element: <LeaveReports />,
    },

    {
        path: '/reports',
        element: <LeaveReports />,
    },
    {
        path: '/leave/balance',
        element: <LeaveBalance />,
    },
    {
        path: '/leave/balance1',
        element: <LeaveBalance1 />,
    },
    {
        path: '/leave/calender',
        element: <LeaveCalender />,
    },

    {
        path: '/calender',
        element: <LeaveCalender />,
    },

    {
        path: '/calenderBeta',
        element: <LeaveCalenderBeta />,
    },
    
    {
        path: '/leave/assign',
        element: <LeaveAssign />,
    },
    {
        path: '/leave/configuration',
        element: <LeaveConfiguration />,
    },
    {
        path: '/Permission/apply',
        element: <PermissionApply />,
    },
    {
        path: '/Permission/status',
        element: <PermissionStatus />,
    },
    {
        path: '/auth/register',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/auth/password-reset',
        element: <RecoverIdBoxed />,
        layout: 'blank',
    },
    {
        path: '/auth/unlock',
        element: <Unlock />,
        layout: 'blank',
    },
    // dashboard
    {
        path: '/',
        element: <Index />,
    },  
    // User
    {
        path: '/users',
        element: <UserList />,
    },
    {
        path: '/users/add',
        element: <UserAdd />,
    },
    {

        path: '/users/edit/:id',
        element: <UserEdit />,
    },
    {

        path: '/salutations',
        element: <Salutations />,
    },
    {

        path: '/mail-service',
        element: <MailService />,
    },
    // Contacts
    {
        path: '/contacts',
        element: <ContactList />,
    },
    {
        path: '/contacts/add',
        element: <ContactAdd />,
    },
    {
        path: '/contacts/edit/:id',
        element: <ContactEdit />,
    },
    {
        path: '/contacts/logs',
        element: <ContactLog />,
    },
    
    // error
    {
        path: '/pages/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/pages/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/pages/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },
    {
        path: '/pages/maintenence',
        element: <Maintenence />,
        layout: 'blank',
    },
   
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
