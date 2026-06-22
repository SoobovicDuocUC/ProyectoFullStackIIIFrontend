import { Label } from '../01.- Atoms/Label';
import { Input } from '../01.- Atoms/Input';

export const FormField = ({ label, id, type, placeholder, value, onChange, required }) => {
  return (
    <div className="form-group">
      <Label htmlFor={id} text={label} />
      <Input 
        type={type} 
        id={id} 
        name={id} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};