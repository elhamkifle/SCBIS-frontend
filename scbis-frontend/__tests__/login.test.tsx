import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/components/Sessions/Login';


// Mock next/navigation useRouter
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock Zustand stores
const setEmailMock = jest.fn();
const setPasswordMock = jest.fn();
const setErrorMock = jest.fn();
const resetLoginMock = jest.fn();
const setUserMock = jest.fn();

jest.mock('@/store/authStore/useLoginStore', () => () => ({
  email: '',
  password: '',
  error: '',
  setEmail: setEmailMock,
  setPassword: setPasswordMock,
  setError: setErrorMock,
  resetLogin: resetLoginMock,
}));

jest.mock('@/store/authStore/useUserStore', () => () => ({
  setUser: setUserMock,
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs and buttons', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email address \/ phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/don'?t have an account yet/i)).toBeInTheDocument();
  });

  it('shows validation errors if email or password invalid', async () => {
    render(<Login />);

    // Click login without typing anything
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/password/i)).toBeInTheDocument();
    });
  });

  it('calls fetch and navigates on successful login', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'fakeAccessToken',
        refreshToken: 'fakeRefreshToken',
        user: { id: '123', name: 'John Doe' },
      }),
    });

    render(<Login />);

    // Simulate filling inputs
    setEmailMock.mockImplementation((val) => {});
    setPasswordMock.mockImplementation((val) => {});

    // Since your store hooks return empty strings,
    // We need to temporarily override email and password
    // But your code directly reads from useLoginStore, so simulate by changing mocks?

    // Instead, let's spy on setEmail and setPassword being called
    fireEvent.change(screen.getByLabelText(/email address \/ phone/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'validpassword' },
    });

    // For your Zustand hooks that hold email/password, 
    // since they return '', the component will read empty values.
    // Ideally you'd mock useLoginStore with a more advanced mock.

    // To keep it simple, let's override the entire useLoginStore:
    jest.mock('@/store/authStore/useLoginStore', () => () => ({
      email: 'test@example.com',
      password: 'validpassword',
      error: '',
      setEmail: setEmailMock,
      setPassword: setPasswordMock,
      setError: setErrorMock,
      resetLogin: resetLoginMock,
    }));

    // Click login
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for fetch and router.push
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(setUserMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: '123', name: 'John Doe' }),
      );
      expect(pushMock).toHaveBeenCalledWith(
        '/policy-purchase/personal-information/personalDetails',
      );
    });
  });

  it('displays server error message on failed login', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(<Login />);

    // Mock email/password to pass validation
    jest.mock('@/store/authStore/useLoginStore', () => () => ({
      email: 'test@example.com',
      password: 'wrongpassword',
      error: '',
      setEmail: setEmailMock,
      setPassword: setPasswordMock,
      setError: setErrorMock,
      resetLogin: resetLoginMock,
    }));

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(setErrorMock).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('displays network error on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    render(<Login />);

    // Mock email/password to pass validation
    jest.mock('@/store/authStore/useLoginStore', () => () => ({
      email: 'test@example.com',
      password: 'validpassword',
      error: '',
      setEmail: setEmailMock,
      setPassword: setPasswordMock,
      setError: setErrorMock,
      resetLogin: resetLoginMock,
    }));

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(setErrorMock).toHaveBeenCalledWith('Network error. Please check your connection.');
    });
  });

  it('disables login button and shows loading while submitting', async () => {
    let resolveFetch: () => void;
    (fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = () =>
            resolve({
              ok: true,
              json: async () => ({
                accessToken: 'token',
                refreshToken: 'token',
                user: { id: '123', name: 'John' },
              }),
            });
        }),
    );

    render(<Login />);

    jest.mock('@/store/authStore/useLoginStore', () => () => ({
      email: 'test@example.com',
      password: 'validpassword',
      error: '',
      setEmail: setEmailMock,
      setPassword: setPasswordMock,
      setError: setErrorMock,
      resetLogin: resetLoginMock,
    }));

    const button = screen.getByRole('button', { name: /Login/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();

    // Finish fetch
    resolveFetch!();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
