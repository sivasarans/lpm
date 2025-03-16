import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

const Date = () => {
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef();

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Select Date Range
      </h2>

      {/* Date Picker Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      >
        <Calendar className="mr-2 w-5 h-5" />
        {`${format(range[0].startDate, "dd MMM yyyy")} - ${format(
          range[0].endDate,
          "dd MMM yyyy"
        )}`}
      </button>

      {/* Selected Date Info */}
      <div className="mt-3 text-gray-700">
        <p>📅 From: <span className="font-semibold">{format(range[0].startDate, "dd MMM yyyy")}</span></p>
        <p>📅 To: <span className="font-semibold">{format(range[0].endDate, "dd MMM yyyy")}</span></p>
      </div>

      {/* Date Picker Popup */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-10 mt-3 bg-white shadow-lg rounded-lg p-2 border"
        >
          <DateRange
            editableDateInputs
            ranges={range}
            onChange={(ranges) => {
              setRange([ranges.selection]);
              setShowPicker(false); // Close after selection
            }}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Date;
