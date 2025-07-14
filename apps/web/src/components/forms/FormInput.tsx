import {Input} from '../ui/input';
import {Label} from '../ui/label';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
}

export function FormInput({
  id,
  name,
  label,
  value,
  onBlur,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoFocus,
  required,
}: FormInputProps) {
  return (
    <div className='my-3'>
      <Label htmlFor={id} className='my-1'>
        {label}
        {required && ' *'}
      </Label>
      <Input
        id={id}
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className='w-full'
      />
      {error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
    </div>
  );
}
