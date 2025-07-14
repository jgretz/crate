import {Textarea} from '../ui/textarea';
import {Label} from '../ui/label';

interface FormTextAreaProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export function FormTextArea({
  id,
  name,
  label,
  value,
  onBlur,
  onChange,
  error,
  placeholder,
  rows = 3,
  required,
}: FormTextAreaProps) {
  return (
    <div className='my-3'>
      <Label htmlFor={id} className='my-1'>
        {label}
        {required && ' *'}
      </Label>
      <Textarea
        id={id}
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
      {error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
    </div>
  );
}
