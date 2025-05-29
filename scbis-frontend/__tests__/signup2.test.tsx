import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignupStep2 from '@/components/Sessions/Signup2'
import '@testing-library/jest-dom'
import { useRouter } from 'next/router'

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('SignupStep2 Component', () => {
  const push = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push })
    fetchMock.resetMocks()
  })

  it('renders all input fields and the signup button', () => {
    render(<SignupStep2 />)

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument()
  })

  it('shows error if passwords do not match', async () => {
    render(<SignupStep2 />)

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'different123' },
    })

    fireEvent.click(screen.getByText(/Signup/i))

    await waitFor(() => {
      expect(
        screen.getByText(/Passwords do not match/i)
      ).toBeInTheDocument()
    })
  })

  it('shows error if fetch fails with message', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Email already exists' }),
      { status: 400 }
    )

    render(<SignupStep2 />)

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'exists@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByText(/Signup/i))

    await waitFor(() => {
      expect(
        screen.getByText(/Email already exists/i)
      ).toBeInTheDocument()
    })
  })

  it('navigates on successful registration', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: true }), {
      status: 200,
    })

    render(<SignupStep2 />)

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'new@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByText(/Signup/i))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/verification')
    })
  })
})
