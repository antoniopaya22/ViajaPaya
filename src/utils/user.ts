export function displayNameFromEmail(email: string): string {
  const prefix = email.split('@')[0] ?? email;
  return prefix
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}
