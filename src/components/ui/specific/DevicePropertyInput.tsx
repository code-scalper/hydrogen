interface DevicePropertyInputProps {
  label: string;
  value: string;
  unit: string;
  onChange: (value: string) => void;
}

const DevicePropertyInput = ({
  label,
  value,
  unit,
  onChange,
}: DevicePropertyInputProps) => {
  return (
    <div className="p-2 flex items-center justify-between  rounded shadow-sm mb-2">
      <label className="text-xs  text-slate-200 w-1/3">{label}</label>
      <input
        type="text"
        className="w-1/2 px-2 py-1 text-xs bg-gray-700 text-white  border-b border-slate-600 focus:outline-none focus:border-b-2 focus:border-blue-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="text-slate-400 text-xs w-1/6 text-right">{unit}</span>
    </div>
  );
};

export default DevicePropertyInput;
