import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react';
interface MultiSelectDropdownProps {
  formFieldName: string;
  options: string[];
  selectedValues:any;
  onChange: (selectedOptions: string[]) => void;
  prompt?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  formFieldName,
  options,
  selectedValues,
  onChange,
  prompt = "Select one or more options",
}) => {
  const [isJsEnabled, setIsJsEnabled] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any>(selectedValues);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsJsEnabled(true);
  }, []);

  useEffect(() => {
    // Filter options based on the search term
    const filtered = options.filter((option: any) =>
      option?.name.toLowerCase().includes(searchTerm)
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  const handleChange = (option: string) => {
    const isSelected = selectedOptions.includes(option);
    const newSelectedOptions = isSelected
      ? selectedOptions.filter((selectedOption:any) => selectedOption !== option)
      : [...selectedOptions, option];

    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const isSelectAllEnabled = selectedOptions.length < filteredOptions.length;

  const handleSelectAllClick = () => {
    const allOptions = filteredOptions.filter(
      (option) => !selectedOptions.includes(option)
    );
    setSelectedOptions([...selectedOptions, ...allOptions?.map((option: any) => parseInt(option.id)) || []]);
    const contactIds = allOptions.map(row => row.id);
    onChange([...selectedOptions, ...contactIds]);

  };

  const isClearSelectionEnabled = selectedOptions.length > 0;

  const handleClearSelectionClick = () => {
    setSelectedOptions([]);
    onChange([]);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleModal}
        className="cursor-pointer border rounded px-5 py-2"
      >
        {prompt}
        {isJsEnabled && selectedOptions.length > 0 && (
          <span className="ml-1 text-blue-500">{`(${selectedOptions.length} selected)`}</span>
        )}
      </button>

      {isModalOpen && (
        <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" open={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)}>
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
                        <Dialog.Panel as="div" className="panel my-8 w-full  max-w-4xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                        <div className=" flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
          <div className=" p-4 max-w-md w-full">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search options"
                className="form-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleSelectAllClick}
                disabled={!isSelectAllEnabled}
                className="w-full text-left px-2 py-1 text-blue-600 disabled:opacity-50"
              >
                {"Select All"}
              </button>
              <button
                onClick={handleClearSelectionClick}
                disabled={!isClearSelectionEnabled}
                className="w-full text-left px-2 py-1 text-blue-600 disabled:opacity-50"
              >
                {"Clear selection"}
              </button>
              {filteredOptions.map((option: any) => (
                
                 <label
                 key={option.id}
                 className={`flex whitespace-nowrap cursor-pointer transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200`}
               >
                 <input
                   type="checkbox"
                   name={formFieldName}
                   value={option.id}
                   checked = { selectedOptions.includes(option.id)}
                   className="cursor-pointer"
                   onChange={() => handleChange(option.id)}
                 />
                 <span className="ml-1">{option.name}</span>
               </label>
              ))}
            </div>
            <button className="mt-4 btn btn-sm btn-danger" onClick={toggleModal}>
              Close
            </button>
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
