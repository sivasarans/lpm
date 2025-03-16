import { useEffect, useState } from 'react';
import 'flatpickr/dist/flatpickr.css';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../../services/contactService';
const Edit = () => {
    const dispatch = useDispatch();

    const { id } = useParams();
    const [formData, setFormData] = useState<any>({
        name: '',
        type: '',
        salutation: '',
        organization: '',
        job_title: '',
        mobile1: '',
        mobile2: '',
        mobile3: '',
        email1: '',
        email2: '',
        email3: '',
        status: 1,
    });
    const [loader, setLoader] = useState<any>(false);
    const navigate = useNavigate();
    const GeContact = async () => {
        try {
            const response = await contactService.getContact(id);
            const contact = response.contact;
            setFormData(contact);
        } catch (error) {
            return ('Something Went Wrong');
        }
    }
    useEffect(() => {
        dispatch(setPageTitle('Edit Contact'));
        GeContact();
    }, []);
    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setLoader(true);

            await contactService.updateContact(formData, id);
            showMessage('Contact Updated successfully');
            navigate('/contacts');
        } catch (error: any) {
            let message;
            if (error.response.data.errors) {
                message = error?.response?.data?.errors[0]?.msg;
            }
            if (!message) {
                message = error.response.data.message
            }
            // Handle other error types as needed
            showMessage(message, 'error');
        } finally {
            setLoader(false);
        }
    };
    const handleInputChange = (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        console.log(event.target.value);
        setFormData({
            ...formData,
            [fieldName]: event.target.value,
        });
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Contacts
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Edit</span>
                </li>
            </ul>

            <div className="pt-5 grid  grid-cols-1 gap-6">



                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Edit Contact</h5>

                    </div>
                    <div className="mb-5">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name">Name *</label>
                                    <input type="text" id="name" value={formData.name} onChange={(value) => handleInputChange('name', value)} placeholder="Enter Name " className="form-input" />
                                </div>
                                <div>
                                    <label htmlFor="type">Type *</label>
                                    <select id="type" className="form-select" value={formData.type} onChange={(value) => handleInputChange('type', value)}>
                                        <option value=" ">Choose</option>
                                        <option value="Employee">Employee</option>
                                        <option value="Customer">Customer</option>
                                        <option value="Contractor">Contractor</option>
                                        <option value="Supplier">Supplier</option>
                                        <option value="Service Provider">Service Provider</option>
                                        <option value="Colleges">Colleges </option>
                                        <option value="General">General</option>

                                    </select>
                                </div>

                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="salutation">Salutation *</label>
                                    <input id="salutation" type="text" placeholder="Enter Salutation*" className="form-input" value={formData.salutation} onChange={(value) => handleInputChange('salutation', value)} />
                                </div>
                                <div>
                                    <label htmlFor="organization">Organization *</label>
                                    <input id="organization" type="text" placeholder="Enter Organization *" className="form-input" value={formData.organization} onChange={(value) => handleInputChange('organization', value)} />
                                </div>

                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="job_title">Job Title</label>
                                    <input id="job_title" type="text" placeholder="Enter Job Title *" className="form-input" value={formData.job_title} onChange={(value) => handleInputChange('job_title', value)} />
                                </div>
                                <div>
                                    <label htmlFor="mobile1">Mobile *</label>
                                    <input id="mobile1" type="text" placeholder="Enter Mobile *" className="form-input" value={formData.mobile1} onChange={(value) => handleInputChange('mobile1', value)} />
                                </div>
                                <div>
                                    <label htmlFor="mobile2">Mobile 2 </label>
                                    <input id="mobile2" type="text" placeholder="Enter Mobile 2 " className="form-input" value={formData.mobile2} onChange={(value) => handleInputChange('mobile2', value)} />
                                </div>
                                <div>
                                    <label htmlFor="mobile3">Mobile 3 </label>
                                    <input id="mobile3" type="text" placeholder="Enter Mobile 3 " className="form-input" value={formData.mobile3} onChange={(value) => handleInputChange('mobile3', value)} />
                                </div>
                                <div>
                                    <label htmlFor="email1">Email *</label>


                                    <div className="flex">
                                        <input id="email1" type="email" placeholder="Enter Email *" className="form-input ltr:rounded-r-none rtl:rounded-l-none" value={formData.email1} onChange={(value) => handleInputChange('email1', value)} />
                                        <div className="bg-[#eee] cursor-pointer flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-bold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#fef2f2] text-sm">
                                            Verify
                                        </div>

                                    </div>

                                </div>
                                <div>
                                    <label htmlFor="email2">Email2</label>
                                    <input id="email2" type="email" placeholder="Enter Email 2 " className="form-input" value={formData.email2} onChange={(value) => handleInputChange('email2', value)} />
                                </div>
                                <div>
                                    <label htmlFor="email3">Email3</label>
                                    <input id="email3" type="email" placeholder="Enter Email 3 " className="form-input" value={formData.email3} onChange={(value) => handleInputChange('email3', value)} />
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


                            <button type="submit" disabled={loader} className="btn btn-primary !mt-6">
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
                                } Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;
