import { Label } from '../01.- Atoms/Label';
import { Input } from '../01.- Atoms/Input';

// 🔴 Agrega value, onChange y required a la lista
export const FormField = ({ label, id, type, placeholder, value, onChange, required }) => {
  return (
    <div className="form-group">
      <Label htmlFor={id} text={label} />
      {/* 🔴 Pásale las nuevas propiedades a tu componente Input */}
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