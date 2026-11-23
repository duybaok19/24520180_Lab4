import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SimpleForm from './SimpleForm';

describe('SimpleForm', () => {
  it('shows email error after typing an invalid email and blurring', async () => {
    const user = userEvent.setup();
    render(<SimpleForm />);

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Email không hợp lệ');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', errorMessage.id);
  });

  it('focuses the corresponding input when its label is clicked', async () => {
    const user = userEvent.setup();
    render(<SimpleForm />);

    const nameInput = screen.getByLabelText('Họ tên');
    await user.click(screen.getByText('Họ tên', { selector: 'label' }));

    expect(nameInput).toHaveFocus();
  });

  it('does not render a definition list when submitted with invalid values', async () => {
    const user = userEvent.setup();
    const { container } = render(<SimpleForm />);

    await user.click(screen.getByRole('button', { name: /gửi/i }));

    expect(container.querySelector('dl')).toBeNull();
    expect(screen.getAllByRole('alert')).toHaveLength(3);
  });

  it('renders exactly three dt/dd pairs after a valid submission', async () => {
    const user = userEvent.setup();
    const { container } = render(<SimpleForm />);

    await user.type(screen.getByLabelText('Họ tên'), 'Nguyen Van A');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Tuổi'), '25');
    await user.click(screen.getByRole('button', { name: /gửi/i }));

    const dl = container.querySelector('dl');
    expect(dl).toBeInTheDocument();
    expect(dl.querySelectorAll('dt')).toHaveLength(3);
    expect(dl.querySelectorAll('dd')).toHaveLength(3);

    expect(within(dl).getByText('fullName')).toBeInTheDocument();
    expect(within(dl).getByText('Nguyen Van A')).toBeInTheDocument();
    expect(within(dl).getByText('email')).toBeInTheDocument();
    expect(within(dl).getByText('test@example.com')).toBeInTheDocument();
    expect(within(dl).getByText('age')).toBeInTheDocument();
    expect(within(dl).getByText('25')).toBeInTheDocument();
  });
});