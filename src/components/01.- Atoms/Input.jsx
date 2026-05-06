export const Input = ({ type = 'text', placeholder, name, id }) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      className="form-input"
    />
  );
};