import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { useEffect } from 'react';

const Index = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    }, [dispatch]);

    const managementSections = [
        { title: 'Leave & Permission Management', link: '/leave/apply', imgSrc: 'leave.png' },
        { title: 'Service Ticket Management', link: '/ticket-management', imgSrc: 'ticket.png' },
        { title: 'Campaign Management', link: '/campaign-management', imgSrc: 'campaign.png' },
        { title: 'Expense Management', link: '/support-management', imgSrc: 'expense.png' },
    ];

    return (
        <>
            <div>
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 place-items-center">
                {managementSections.map((section, index) => (
                    <div key={index} className="text-center">
                        <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                        <Link to={section.link}>
                            <img 
                                src={section.imgSrc} 
                                alt={section.title} 
                                className="w-48 h-48 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform"
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Index;
