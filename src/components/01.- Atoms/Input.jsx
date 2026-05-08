export const Input = ({ type, id, name, placeholder, value, onChange, required }) => {
  return (
    <input 
      className="form-input" /* O la clase CSS que ya tuvieras */
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}         // <-- CRÍTICO
      onChange={onChange}   // <-- CRÍTICO
      required={required}
    />
  );
};