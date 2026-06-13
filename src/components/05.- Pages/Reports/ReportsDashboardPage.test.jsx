import { render, screen, waitFor } from '@testing-library/react';
import { ReportsDashboardPage } from './ReportsDashboardPage';
import { BrowserRouter } from 'react-router-dom';

global.fetch = jest.fn();

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 🟢 FIX: Mock global para react-leaflet (Evita el error de 'export')
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  Polygon: () => <div data-testid="polygon" />,
  Polyline: () => <div data-testid="polyline" />,
  useMap: () => ({
    flyTo: jest.fn(),
  }),
  useMapEvents: () => ({}),
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

    // 🟢 FIX: Usamos getAllByText porque el texto aparece tanto en la tabla como en el mapa
    await waitFor(() => {
      const elementos = screen.getAllByText(/Simulación de alerta de humo/i);
      expect(elementos.length).toBeGreaterThan(0);
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});