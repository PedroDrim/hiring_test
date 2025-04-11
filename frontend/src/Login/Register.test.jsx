/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Register from './Register'
import axios from 'axios'

vi.mock('axios')

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Register Component', () => {
  beforeEach(() => {
    cleanup()
    localStorage.clear()
    vi.clearAllMocks()
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue()
    window.HTMLMediaElement.prototype.pause = vi.fn().mockResolvedValue()
  })

  it('1.1. Must be able to get "Username" placeholder', () => {
    renderWithRouter(<Register/>)
    expect(screen.getByPlaceholderText('Username')).not.toBeNull()
  })

  it('1.2. Must be able to get "Password" placeholder', () => {
    renderWithRouter(<Register/>)
    expect(screen.getByPlaceholderText('Password')).not.toBeNull()
  })

  it('2.1. Must be able to update "Username" field', () => {
    renderWithRouter(<Register/>)
    const usernameInput = screen.getByPlaceholderText('Username')
    fireEvent.change(usernameInput, { target: { value: 'debug' } })

    expect(usernameInput.value).toBe('debug')
  })

  it('2.2. Must be able to update "Password" field', () => {
    renderWithRouter(<Register/>)
    const passwordInput = screen.getByPlaceholderText('Password')
    fireEvent.change(passwordInput, { target: { value: 'debug' } })

    expect(passwordInput.value).toBe('debug')
  })

  it('3.1. Must be able to simulate "handleSubmit" successfully with valid parameters', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'Registration successful!' }
    })
      
    renderWithRouter(<Register/>)

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'validUser' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validPassword' } })
    fireEvent.click(screen.getByText('Register'))

    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).not.toBeNull()
    })
  })

  it('3.2. Must be able to simulate "handleSubmit" and receive error with invalid parameters', async () => {
    axios.post.mockRejectedValueOnce(
      new Error("simulated error")
    )

    renderWithRouter(<Register/>)

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'validUser' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validPassword' } })
    fireEvent.click(screen.getByText('Register'))

    await waitFor(() => {
      expect(screen.getByText('Error registering')).not.toBeNull()
    })
  })
})
