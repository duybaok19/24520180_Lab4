import { useId } from 'react';

function InputField({
  label,
  name,
  type = 'text',
  value,
  error,
  onChange,
  onBlur,
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <section>
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />

      {error && (
        <span id={errorId} role="alert">
          {error}
        </span>
      )}
    </section>
  );
}

export default InputField;
