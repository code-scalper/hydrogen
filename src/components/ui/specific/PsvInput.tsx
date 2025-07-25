import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useEffect, useState } from "react";

interface PsvInputProps {
  label: string;
  value: string;
  unit: string;
  onChange: (value: string) => void;
}

const PsvInput = ({ label, value, unit, onChange }: PsvInputProps) => {
  const [internalValue, setInternalValue] = useState(value);

  const debouncedUpdate = useDebouncedCallback((val: string) => {
    onChange(val);
  }, 500); // 500ms 후 반영

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className="p-2 flex items-center justify-between rounded shadow-sm mb-2">
      <label className=" text-slate-200 w-1/3">{label}</label>
      <input
        type="text"
        className="w-1/2 px-2 py-1bg-gray-700 text-white border-b border-slate-600 focus:outline-none focus:border-b-2 focus:border-blue-600"
        value={internalValue}
        onChange={(e) => {
          const val = e.target.value;
          setInternalValue(val);
          debouncedUpdate(val);
        }}
      />
      <span className="text-slate-400 w-1/6 text-right">
        {unit === "-" ? "" : unit}
      </span>
    </div>
  );
};

export default PsvInput;
