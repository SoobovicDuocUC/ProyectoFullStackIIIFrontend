import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportFireForm } from '../03.- Organisms/ReportFireForm';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();

describe('ReportFireForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) => 
        success({
          coords: {
            latitude: -33.456,
            longitude: -70.648
          }
        })
      )
    };
  });

it('debe mostrar error y NO enviar si falta la ubicación', async () => {
    render(
      <BrowserRouter>
        <ReportFireForm />
      </BrowserRouter>
    );
    
    const textarea = screen.getByLabelText(/Detalle de la Emergencia/i);
    fireEvent.change(textarea, { target: { value: 'Incendio forestal activo.' } });

    const submitButton = screen.getByRole('button', { name: /Enviar Reporte/i });
    const form = submitButton.closest('form');
    fireEvent.submit(form);
    expect(await screen.findByText(/Debes obtener tu ubicación antes de enviar el reporte/i)).toBeInTheDocument();
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('debe enviar el reporte exitosamente y redirigir con el código de seguimiento', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ codigoSeguimiento: "EMERG-999" })
    });
    render(
      <BrowserRouter>
        <ReportFireForm />
      </BrowserRouter>
    );

    const textarea = screen.getByLabelText(/Detalle de la Emergencia/i);
    fireEvent.change(textarea, { target: { value: 'Incendio forestal sector norte.' } });

    const locationBtn = screen.getByRole('button', { name: /Obtener ubicación/i });
    fireEvent.click(locationBtn);

    const submitButton = screen.getByRole('button', { name: /Enviar Reporte/i });
    const form = submitButton.closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/success', {
        state: { codigoSeguimiento: 'EMERG-999' }
      });
    });
  });
});