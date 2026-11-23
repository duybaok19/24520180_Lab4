import { useState } from 'react';

import { validateForm } from './validate';
import { FormContext } from './FormContext';

function SimpleForm() {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    age: '',
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(null);

  // Derive errors directly during render
  const errors = validateForm(values);

  const isValid = Object.keys(errors).length === 0;

  function handleChange(name, value) {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  function handleBlur(name) {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!isValid) {
      setTouched({
        fullName: true,
        email: true,
        age: true,
      });

      return;
    }

    setSubmitted({ ...values });
  }

  const contextValue = {
    values,
    errors,
    isValid,
    touched,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form noValidate onSubmit={handleSubmit}>
      </form>
    </FormContext.Provider>
  );
}

export default SimpleForm;
