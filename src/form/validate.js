export function validateForm(values) {
  const errors = {};

  const { fullName, email, age } = values;

  // Validate full name
  if (fullName.trim().length < 2) {
    errors.fullName = 'Họ tên tối thiểu 2 ký tự';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.email = 'Email không hợp lệ';
  }

  // Validate age: must be an integer from 13 to 120
  const isIntegerString = /^\d+$/.test(age);
  const numericAge = Number(age);

  if (
    !isIntegerString ||
    !Number.isInteger(numericAge) ||
    numericAge < 13 ||
    numericAge > 120
  ) {
    errors.age = 'Tuổi từ 13 đến 120';
  }

  return errors;
}
