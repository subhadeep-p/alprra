// Minimal {{token}} substitution for admin-authored email templates. Pure and
// unit-testable — no I/O.

/**
 * Replaces every `{{key}}` occurrence in `template` with `vars[key]`.
 * Unknown tokens (no matching key in `vars`) are left untouched so a typo in
 * an admin-authored template doesn't silently swallow text.
 */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => {
    return Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  })
}
