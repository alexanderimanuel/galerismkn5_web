import { ValidationErrors } from "../types";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  validationErrors: ValidationErrors;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  validationErrors
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className={`mt-1 appearance-none relative block w-full px-3 py-3 border ${validationErrors[name] ? 'border-red-300' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10`}
        placeholder={placeholder}
      />
      {validationErrors[name] && (
        <p className="mt-1 text-sm text-red-600">{validationErrors[name]}</p>
      )}
    </div>
  );
}