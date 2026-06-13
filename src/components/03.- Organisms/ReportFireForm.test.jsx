import { render, screen } from '@testing-library/react';
import { ReportFireForm } from './ReportFireForm';
import { BrowserRouter } from 'react-router-dom';

global.fetch = jest.fn();

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('leaflet/dist/images/marker-icon.png', () => 'marker-icon.png');
jest.mock('leaflet/dist/images/marker-shadow.png', () => 'marker-shadow.png');

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  useMapEvents: () => ({}),
  useMap: () => ({}),
}));

jest.mock('leaflet', () => ({
  Marker: {
    prototype: {
      options: {},
    },
  },
  icon: jest.fn(() => ({})),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
      mergeOptions: jest.fn(),
    },
  },
}));

describe('ReportFireForm', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(
      <BrowserRouter>
        <ReportFireForm />
      </BrowserRouter>
    );

    expect(screen.getByText(/Enviar Reporte de Emergencia/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo de incendio/i)).toBeInTheDocument();
    expect(screen.getByText(/Detalle de la Emergencia/i)).toBeInTheDocument();
  });
});