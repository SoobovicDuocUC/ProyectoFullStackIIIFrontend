import { render, screen, waitFor } from '@testing-library/react';
import { ReportsDashboardPage } from './ReportsDashboardPage';
import { BrowserRouter } from 'react-router-dom';

global.fetch = jest.fn();

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ReportsDashboardPage', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('debe redirigir inmediatamente a /login si no hay token en LocalStorage', () => {
    render(
      <BrowserRouter>
        <ReportsDashboardPage />
      </BrowserRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('debe consumir la API simulada y mostrar los reportes si el token existe', async () => {
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('usuario', JSON.stringify({ nombre: 'Test', rol: 'ADMIN' }));

    const mockBackendResponse = [
      {
        id: 105,
        descripcion: 'Simulación de alerta de humo',
        estado: 'ACTIVO',
        nivelPrioridad: 'MEDIA',
        latitud: -33.0,
        longitud: -70.0
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockBackendResponse,
    });

    render(
      <BrowserRouter>
        <ReportsDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Conectando con el servidor/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Simulación de alerta de humo/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});