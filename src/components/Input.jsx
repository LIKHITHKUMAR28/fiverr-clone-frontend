const Input = ({ type = 'text', name, placeholder, value, onChange, className = '', ...rest }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...rest}
    />
  );
};

export default Input;
