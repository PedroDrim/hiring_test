/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, BrowserRouter } from 'react-router-dom'
import Login from './Login'
import axios from 'axios'

vi.mock('axios')

const mockNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const mockOnLogin = vi.fn()

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Login Component', () => {
  beforeEach(() => {
    cleanup()
    localStorage.clear()
    vi.clearAllMocks()
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue()
    window.HTMLMediaElement.prototype.pause = vi.fn().mockResolvedValue()
  })

  it('1.1. Must be able to get "Username" placeholder', () => {
    renderWithRouter(<Login onLogin={mockOnLogin} />)
    expect(screen.getByPlaceholderText('Username')).not.toBeNull()
  })

  it('1.2. Must be able to get "Password" placeholder', () => {
    renderWithRouter(<Login onLogin={mockOnLogin} />)
    expect(screen.getByPlaceholderText('Password')).not.toBeNull()
  })

  it('2.1. Must be able to update "Username" field', () => {
    renderWithRouter(<Login onLogin={mockOnLogin} />)
    const usernameInput = screen.getByPlaceholderText('Username')
    fireEvent.change(usernameInput, { target: { value: 'debug' } })

    expect(usernameInput.value).toBe('debug')
  })

  it('2.2. Must be able to update "Password" field', () => {
    renderWithRouter(<Login onLogin={mockOnLogin} />)
    const passwordInput = screen.getByPlaceholderText('Password')
    fireEvent.change(passwordInput, { target: { value: 'debug' } })

    expect(passwordInput.value).toBe('debug')
  })

  it('3.1. Must be able to mock "logIn" successfully with valid parameters', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'jwt1',
        userID: 'uid1'
      }
    })

    renderWithRouter(<Login onLogin={mockOnLogin} />)

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'validUser' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validPassword' } })
    fireEvent.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('jwt1')
      expect(localStorage.getItem('userID')).toBe('uid1')
      expect(mockOnLogin).toHaveBeenCalled()
    })
  })

  it('3.2. Must be able to mock "logIn" and receive error with invalid parameters', async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 400 }
    })

    renderWithRouter(<Login onLogin={mockOnLogin} />)

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'invalidUser' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'invalidPassword' } })
    fireEvent.click(screen.getByText('Login'))

    await waitFor(() => {
      const errorMessage = screen.queryByText('User not found. Please register first.')
      expect(errorMessage).not.toBeNull()
    })
  })

  it('4.1. Must be able to redirect to Register', async () => {
    render(<Login onLogin={mockOnLogin} />, { wrapper: MemoryRouter })

    fireEvent.click(screen.getByText('Register'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/register")
    })
  })
})
