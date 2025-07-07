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
    <div className="m-4 flex flex-col w-full h-full text-2xl">
      <label htmlFor={id} className="m-2">
        {label}
      </label>
      <input
        className="p-2 bg-gray-100 rounded-md w-sm h-15"
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
