export const Label = ({ htmlFor, text }) => {
  return (
    <label htmlFor={htmlFor} className="form-label">
      {text}
    </label>
  );
};