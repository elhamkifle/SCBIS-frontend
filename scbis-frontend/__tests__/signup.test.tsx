import { render, screen, fireEvent } from '@testing-library/react'
import Signup from '@/app/signup/page'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'
import useSignupStore from '@/store/authStore/useSignupStore'

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: () => () => null,
  });
});


// Mock Zustand store
jest.mock('@/store/authStore/useSignupStore')

const mockPush = jest.fn()

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush })

  ;((useSignupStore as unknown) as jest.Mock).mockReturnValue({
    fName: '',
    lName: '',
    dob: '',
    pNo: '',
    setFName: jest.fn(),
    setLName: jest.fn(),
    setDob: jest.fn(),
    setPNo: jest.fn(),
  })

  jest.clearAllMocks()
})

describe('Signup Component', () => {
  it('renders all input fields and buttons', () => {
    render(<Signup />)

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date Of Birth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()
    expect(screen.getByText(/Next/i)).toBeInTheDocument()
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
  })

  it('shows error when fields are empty and Next is clicked', () => {
    render(<Signup />)

    fireEvent.click(screen.getByText(/Next/i))

    expect(screen.getByText(/Please fill all the required fields/i)).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('navigates to page2 if all fields are filled', () => {
    // override with filled values
    ((useSignupStore as unknown) as jest.Mock).mockReturnValue({
      fName: 'John',
      lName: 'Doe',
      dob: '2000-01-01',
      pNo: '1234567890',
      setFName: jest.fn(),
      setLName: jest.fn(),
      setDob: jest.fn(),
      setPNo: jest.fn(),
    })

    render(<Signup />)

    fireEvent.click(screen.getByText(/Next/i))

    expect(mockPush).toHaveBeenCalledWith('/signup/page2')
  })

  it('navigates to login page when Login is clicked', () => {
    render(<Signup />)

    fireEvent.click(screen.getByText(/Login/i))

    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
