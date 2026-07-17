import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { Badge } from '@/components/ui';
import { ThemeProvider } from '@/theme';

function renderWithTheme(children: ReactElement) {
  return render(<ThemeProvider>{children}</ThemeProvider>);
}

describe('Badge', () => {
  it('renderiza la etiqueta recibida', async () => {
    const { getByText } = await renderWithTheme(<Badge label="Próximo" variant="info" />);

    expect(getByText('Próximo')).toBeTruthy();
  });
});
