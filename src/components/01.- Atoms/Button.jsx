export const Button = ({ children, onClick, type = 'button' }) => {
  return (
    <button type={type} className="form-button" onClick={onClick}>
      {children}
    </button>
  );
};