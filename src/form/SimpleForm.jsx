import { useState } from 'react';

import { validateForm } from './validate';
import { FormContext, useFormContext } from './FormContext';
import InputField from './InputField';

function FormFields() {
  const {
    values,
    errors,
    touched,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormContext();

  return (
    <form noValidate onSubmit={handleSubmit}>
      <fieldset>
        <legend>Thông tin cá nhân</legend>

        <InputField
          label="Họ tên"
          name="fullName"
          type="text"
          value={values.fullName}
          error={
            touched.fullName || submitted ? errors.fullName : undefined
          }
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          error={
            touched.email || submitted ? errors.email : undefined
          }
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <InputField
          label="Tuổi"
          name="age"
          type="text"
          value={values.age}
          error={
            touched.age || submitted ? errors.age : undefined
          }
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </fieldset>

      <button type="submit">Gửi</button>
    </form>
  );
}

function SimpleForm() {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    age: '',
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(null);

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
      <FormFields />
    </FormContext.Provider>
  );
}

export default SimpleForm;

