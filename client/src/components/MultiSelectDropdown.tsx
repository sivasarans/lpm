import React, { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { Link } from "react-router-dom";

interface Contact {
  id: string;
  name: string;
  email1: string;
  organization?: string;
}

interface MultiSelectDropdownProps {
  formFieldName: string;
  options: Contact[];
  selectedValues: { to: Contact[], cc: Contact[], bcc: Contact[] };
  setSearchContacts: (searchTerm: string) => void;
  onChange: (selectedOptions: { to: Contact[], cc: Contact[], bcc: Contact[] }) => void;
  prompt?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  formFieldName,
  options,
  selectedValues,
  setSearchContacts,
  onChange,
  prompt = "Select one or more options",
}) => {
  const [isJsEnabled, setIsJsEnabled] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(selectedValues);
  const [contactType, setContactType] = useState('to');
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Contact[]>(options);
  const [searchSelectedTerm, setSearchSelectedTerm] = useState("");
  const [filteredSelectedOptions, setFilteredSelectedOptions] = useState<Contact[]>(selectedValues[contactType]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSelectedPage, setCurrentSelectedPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setIsJsEnabled(true);
  }, []);

  useEffect(() => {
    const filtered = options.filter(option => option.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    let filteredSelected = selectedOptions[contactType].filter(option => option.name.toLowerCase().includes(searchSelectedTerm.toLowerCase()));
    filteredSelected = selectedOptions[contactType].filter(option => option.email1.toLowerCase().includes(searchSelectedTerm.toLowerCase()));
    filteredSelected = selectedOptions[contactType].filter(option => option.organization.toLowerCase().includes(searchSelectedTerm.toLowerCase()));
    setFilteredSelectedOptions(filteredSelected);
  }, [searchSelectedTerm, selectedOptions, contactType]);

  const handleChange = useCallback((option: string) => {

    if (option) {
      setSearchContacts(option);
      setCurrentPage(1);
    }
  }, [setSearchContacts]);

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  const handleOnMove = useCallback((contact: Contact) => {
    const newFilteredOptions = filteredOptions.filter(option => option.id !== contact.id);
    setFilteredOptions(newFilteredOptions);

    const updateSelected = (type: string) => {
      if (!selectedOptions[type].some(c => c.id === contact.id)) {
        const updatedSelected = [...selectedOptions[type], contact];
        const newSelectedOptions = { ...selectedOptions, [type]: updatedSelected };
        setSelectedOptions(newSelectedOptions);

        onChange(newSelectedOptions);
      }
    };

    updateSelected(contactType);
  }, [filteredOptions, selectedOptions, contactType, onChange]);

  const handleMoveAll = useCallback(() => {
    const nonDuplicateContacts = filteredOptions.filter(contact => !selectedOptions[contactType].some(c => c.id === contact.id));
    const newSelectedOptions = { ...selectedOptions, [contactType]: [...selectedOptions[contactType], ...nonDuplicateContacts] };
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  }, [filteredOptions, selectedOptions, contactType, onChange]);

  const handleOnRemove = useCallback((contact: Contact) => {
    const updateSelected = (type: string) => {
      const updatedSelected = selectedOptions[type].filter(option => option.id !== contact.id);
      const newSelectedOptions = { ...selectedOptions, [type]: updatedSelected };
      setSelectedOptions(newSelectedOptions);
      onChange(newSelectedOptions);
    };

    updateSelected(contactType);
  }, [filteredOptions, selectedOptions, contactType, onChange]);

  const handleOnRemoveAll = useCallback(() => {
    const newSelectedOptions = { to: [], cc: [], bcc: [] };
    setSelectedOptions({ ...selectedOptions, [contactType]: [] });
    onChange(newSelectedOptions);
  }, [filteredOptions, selectedOptions, contactType, onChange]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredOptions.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, filteredOptions]);

  const currentSelectedItems = useMemo(() => {
    const indexOfLastItem = currentSelectedPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredSelectedOptions.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentSelectedPage, itemsPerPage, filteredSelectedOptions, selectedOptions]);

  return (
    <div className="relative">
      <button onClick={toggleModal} className="cursor-pointer border rounded px-5 py-2">
        {prompt}
        {isJsEnabled && (selectedOptions.to.length + selectedOptions.cc.length + selectedOptions.bcc.length) > 0 && (
          <span className="ml-1 text-blue-500">{`(${selectedOptions.to.length + selectedOptions.cc.length + selectedOptions.bcc.length} selected)`}</span>
        )}
      </button>

      {isModalOpen && (
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" open={isModalOpen} onClose={toggleModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0" />
            </Transition.Child>
            <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
              <div className="flex min-h-screen items-start justify-center px-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="panel my-8 w-full h-110 h-3/4 max-w-8xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                    <div className="grid grid-cols-2 gap-2 bg-[#fbfbfb] px-5 py-2 dark:bg-[#121c2c]">
                      <div className="border-r-4 border-r-indigo-200 h-full mr-2 p-2 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-md mx-auto dark:text-white-light text-primary">Search Contact</h5>
                        </div>
                        <div className="table-responsive h-100 w-full">
                          <div className="mb-2.5 flex md:items-center md:flex-row flex-col gap-5">
                            <div className="flex items-center gap-2">
                              <button onClick={handleMoveAll} className="btn btn-sm btn-primary cursor-pointer gap-2">
                                Move All
                              </button>
                            </div>
                            <div>
                              <select id="type" name="type" onChange={(e) => setContactType(e.target.value)} value={contactType} className="form-select text-xs h-8 pr-6">
                                <option value="to">TO</option>
                                <option value="cc">CC</option>
                                <option value="bcc">BCC</option>
                              </select>
                            </div>
                            <div className="ltr:ml-auto rtl:mr-auto">
                              <input type="text"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleChange(e.target.value);
                                }}
                                className="form-input w-auto h-8" placeholder="Search..." />
                            </div>
                          </div>
                          <table style={{ height: '400px' }} className="border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 w-full">
                            <thead>
                              <tr className="border-b-0">
                                <th className="ltr:rounded-l-md rtl:rounded-r-md text-xs p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">Contact</th>
                                <th className="ltr:rounded-r-md rtl:rounded-l-md text-xs p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">Email</th>
                                <th className="ltr:rounded-r-md rtl:rounded-l-md text-xs p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">Action</th>
                              </tr>
                            </thead>
                            <tbody style={{ height: 'calc(100% - 10px)', display: 'table-row-group', flexGrow: 1 }}>
                              {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                  <tr key={index} style={{ height: '10px' }} className=" text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="p-0 text-black dark:text-white border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">
                                      <div className="flex p-0">
                                        <p className="text-wrap text-xs">
                                          {item.name} <span className="text-warning text-wrap block text-xs">{item.organization}</span>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="text-wrap text-xs p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">{item.email1}</td>
                                    <td className="p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">
                                      <button onClick={() => handleOnMove(item)} className="text-success text-xs cursor-pointer flex items-center">
                                        Move
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                // Fill remaining space with empty rows if there's no content
                                <tr className="text-white-dark">
                                  <td colSpan="3" className="p-2 text-center border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">
                                    No data available
                                  </td>
                                </tr>
                              )}
                              {/* Empty rows to fill the remaining space */}
                              {Array.from({ length: Math.max(0, Math.floor(5 - currentItems.length)) }).map((_, idx) => (
                                <tr key={`empty-${idx}`} className="text-white-dark h-4">
                                  <td className="">&nbsp;</td>
                                  <td className="">&nbsp;</td>
                                  <td className="">&nbsp;</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>


                          {filteredOptions.length > itemsPerPage && (
                            <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto mb-2">
                              {Array.from({ length: Math.ceil(filteredOptions.length / itemsPerPage) }).map((_, index) => (
                                <li key={index}>
                                  <button
                                    className="btn btn-sm rounded-md text-sm btn-outline-primary border-0 dark:text-white-dark text-xs dark:bg-[#343444] shadow-sm hover:bg-primary/90 dark:hover:bg-primary/90 dark:hover:text-white"
                                    onClick={() => setCurrentPage(index + 1)}
                                  >
                                    {index + 1}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="h-full p-2 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-md text-success mx-auto dark:text-white-light ">Selected Contacts</h5>
                        </div>
                        <div className="table-responsive h-100 w-full ">
                          <div className="mb-2.5 flex md:items-center md:flex-row flex-col gap-5">
                            <div className="flex items-center gap-2">
                              <button onClick={handleOnRemoveAll} className="btn btn-sm btn-primary cursor-pointer gap-2">
                                Remove All
                              </button>
                            </div>
                            <div>
                              <select id="type" name="type" onChange={(e) => setContactType(e.target.value)} value={contactType} className="form-select text-xs h-8 pr-6">
                                <option value="to">TO</option>
                                <option value="cc">CC</option>
                                <option value="bcc">BCC</option>
                              </select>
                            </div>
                            <div className="ltr:ml-auto rtl:mr-auto">
                              <input type="text"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    setSearchSelectedTerm(e.target.value);
                                }}
                                className="form-input w-auto h-8" placeholder="Search selected..." />
                            </div>
                          </div>
                          <table className="border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">
                            <thead>
                              <tr className="border-b-0">
                                <th className="ltr:rounded-l-md rtl:rounded-r-md text-xs p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">Contact</th>
                                <th className="ltr:rounded-r-md rtl:rounded-l-md text-xs p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">Email</th>
                                <th className="ltr:rounded-r-md rtl:rounded-l-md text-xs p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentSelectedItems.map((item, index) => (
                                <tr key={index} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                  <td className="text-black dark:text-white border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800
">
                                    <div className="flex p-0">
                                      <p className="text-wrap text-xs">
                                        {item.name} <span className="text-warning text-wrap block text-xs">{item.organization}</span>
                                      </p>
                                    </div>
                                  </td>
                                  <td className="text-wrap text-xs p-0  border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800
">{item.email1}</td>
                                  <td className="p-0 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800
">
                                    <button onClick={() => handleOnRemove(item)} className="text-danger text-xs cursor-pointer flex items-center">
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {filteredSelectedOptions.length > itemsPerPage && (
                            <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto mb-2">
                              {Array.from({ length: Math.ceil(filteredSelectedOptions.length / itemsPerPage) }).map((_, index) => (
                                <li key={index}>
                                  <button
                                    className="btn btn-sm rounded-md text-sm btn-outline-primary border-0 dark:text-white-dark text-xs dark:bg-[#343444] shadow-sm hover:bg-primary/90 dark:hover:bg-primary/90 dark:hover:text-white"
                                    onClick={() => setCurrentSelectedPage(index + 1)}
                                  >
                                    {index + 1}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="flex mx-auto items-center border-t border-slate-100 rounded-b-md dark:border-[#191e3a]">
                        <button
                          type="button"
                          className="btn btn-sm text-xs  btn-outline-danger"
                          onClick={toggleModal}
                        >
                          Close
                        </button>
                        <Link to="/contacts" className="btn btn-sm text-xs btn-primary ml-4">
                          Manage Contacts
                        </Link>
                      </div>
                    </div>

                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
