interface inputProps {
  type: string;
  value: string;
  placeholder: string;
  onChangeHandler: (e: any) => void;
  label: string;
  id: string;
}

function Input({
  placeholder,
  value,
  onChangeHandler,
  type,
  label,
  id,
}: inputProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-base md:text-lg font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        className="p-3 md:p-4 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-sm md:text-base"
        type={type}
        value={value}
        placeholder={placeholder}
        id={id}
        onChange={onChangeHandler}
      />
    </div>
  );
}

export default Input;
