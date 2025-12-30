import { ValidationErrors } from "../types";

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  validationErrors: ValidationErrors;
  isLoading?: boolean;
  loadingText?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Pilih opsi",
  required = false,
  validationErrors,
  isLoading = false,
  loadingText = "Memuat..."
}: SelectFieldProps) {
  if (isLoading) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span className="text-gray-500">{loadingText}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className={`mt-1 appearance-none relative block w-full px-3 py-3 border ${validationErrors[name] ? 'border-red-300' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {validationErrors[name] && (
        <p className="mt-1 text-sm text-red-600">{validationErrors[name]}</p>
      )}
    </div>
  );
}