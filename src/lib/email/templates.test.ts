import { describe, it, expect } from 'vitest'
import { renderTemplate } from './templates'

describe('renderTemplate', () => {
  it('substitutes a single token', () => {
    expect(renderTemplate('Hi {{name}}!', { name: 'Priya' })).toBe('Hi Priya!')
  })

  it('substitutes multiple distinct tokens', () => {
    expect(
      renderTemplate('Order {{orderNumber}} for {{name}} is done.', {
        orderNumber: 'ALP-123',
        name: 'Priya',
      })
    ).toBe('Order ALP-123 for Priya is done.')
  })

  it('substitutes a repeated token everywhere it appears', () => {
    expect(renderTemplate('{{name}}, hi {{name}}!', { name: 'Priya' })).toBe('Priya, hi Priya!')
  })

  it('tolerates internal whitespace inside the braces', () => {
    expect(renderTemplate('Hi {{ name }}!', { name: 'Priya' })).toBe('Hi Priya!')
  })

  it('leaves unknown tokens untouched instead of erroring', () => {
    expect(renderTemplate('Hi {{unknown}}!', { name: 'Priya' })).toBe('Hi {{unknown}}!')
  })

  it('returns the template unchanged when it has no tokens', () => {
    expect(renderTemplate('Plain text.', { name: 'Priya' })).toBe('Plain text.')
  })

  it('replaces a token with an empty string when the value is empty', () => {
    expect(renderTemplate('Hi {{name}}!', { name: '' })).toBe('Hi !')
  })
})
