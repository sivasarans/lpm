import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

const Dat = () => {
  const [range, setRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) =>
      pickerRef.current &&
      !pickerRef.current.contains(e.target) &&
      setShowPicker(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Date Range</h2>
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        <Calendar className="mr-2" />
        {`${format(range[0].startDate, "dd MMM yyyy")} - ${format(
          range[0].endDate,
          "dd MMM yyyy"
        )}`}
      </button>
      <div className="mt-2">
        <p>From Date: {format(range[0].startDate, "dd MMM yyyy")}</p>
        <p>To Date: {format(range[0].endDate, "dd MMM yyyy")}</p>
      </div>
      {showPicker && (
        <div className="mt-4" ref={pickerRef}>
          <DateRange
            editableDateInputs
            ranges={range}
            onChange={(ranges) => {
              setRange([ranges.selection]);
              setShowPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Dat;
