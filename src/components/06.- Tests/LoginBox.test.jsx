import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginBox } from '../03.- Organisms/LoginBox';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();

describe('LoginBox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('debe renderizar correctamente los campos Correo Electrónico y Contraseña', () => {
    render(
      <BrowserRouter>
        <LoginBox />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('debe iniciar sesión exitosamente y redirigir a /reportes', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-jwt-token', usuario: { nombre: 'Admin' } })
    });

    render(
      <BrowserRouter>
        <LoginBox />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    
    fireEvent.change(emailInput, { target: { value: 'admin@innovatech.cl' } });
    fireEvent.change(passwordInput, { target: { value: '12345678' } });

    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    const form = submitButton.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(mockNavigate).toHaveBeenCalledWith('/reportes');
    });
  });

  it('debe mostrar un mensaje de error si las credenciales son incorrectas', async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    });

    render(
      <BrowserRouter>
        <LoginBox />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'error@innovatech.cl' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'mala' } });

    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    const form = submitButton.closest('form');
    fireEvent.submit(form);

    expect(await screen.findByText(/Credenciales incorrectas/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled(); // No debe redirigir
  });
});