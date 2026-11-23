import { describe, it, expect } from 'vitest';
import { validateForm } from './validate';

describe('validateForm', () => {
  it.each([
    ['', 'Họ tên rỗng'],
    ['A', 'Họ tên chỉ có 1 ký tự'],
  ])('returns fullName error when name is invalid: %s (%s)', (fullName) => {
    const errors = validateForm({
      fullName,
      email: 'test@example.com',
      age: '20',
    });

    expect(errors.fullName).toBe('Họ tên tối thiểu 2 ký tự');
  });

  it('returns email error when email is invalid', () => {
    const errors = validateForm({
      fullName: 'Nguyen Van A',
      email: 'invalid-email',
      age: '20',
    });

    expect(errors.email).toBe('Email không hợp lệ');
  });

  it.each(['12', '121', 'abc', '25.5'])(
    'returns age error when age is invalid: %s',
    (age) => {
      const errors = validateForm({
        fullName: 'Nguyen Van A',
        email: 'test@example.com',
        age,
      });

      expect(errors.age).toBe('Tuổi từ 13 đến 120');
    }
  );

  it('returns an empty object when all values are valid', () => {
    const errors = validateForm({
      fullName: 'Nguyen Van A',
      email: 'test@example.com',
      age: '25',
    });

    expect(errors).toEqual({});
  });
});
