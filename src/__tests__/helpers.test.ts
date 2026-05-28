import { describe, it, expect } from 'vitest'
import { passwordScore } from '@/components/form-generator/helpers'

describe('passwordScore', () => {
  it('returns 0 for an empty password', () => {
    expect(passwordScore('')).toBe(0)
  })

  it('returns 0 for a short lowercase-only password', () => {
    expect(passwordScore('abc')).toBe(0)
  })

  it('scores length, uppercase, digit and special character each once', () => {
    expect(passwordScore('Abcdefg1!')).toBe(4)
  })

  it('counts only the criteria that are met', () => {
    expect(passwordScore('abcdefgh')).toBe(1) // length only
    expect(passwordScore('Abcdefgh')).toBe(2) // length + uppercase
  })
})
