import { render, screen } from '@testing-library/react';
import { LoginBox } from '../03.- Organisms/LoginBox';
import { BrowserRouter } from 'react-router-dom';

describe('LoginBox', () => {
  it('debe renderizar correctamente los campos RUT y ClaveÚnica', () => {
    render(
      <BrowserRouter>
        <LoginBox />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/R.U.T./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ClaveÚnica/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar con ClaveÚnica/i })).toBeInTheDocument();
  });
});