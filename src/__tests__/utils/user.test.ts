import { displayNameFromEmail } from '@/utils/user';

describe('displayNameFromEmail', () => {
  it('capitaliza cada parte separada por punto/guion/guion bajo', () => {
    expect(displayNameFromEmail('antonio.paya@thenextpangea.com')).toBe('Antonio Paya');
  });

  it('funciona con un solo segmento', () => {
    expect(displayNameFromEmail('antonio@thenextpangea.com')).toBe('Antonio');
  });
});
