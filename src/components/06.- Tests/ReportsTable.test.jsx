import { render, screen } from '@testing-library/react';
import { ReportsTable } from '../03.- Organisms/ReportsTable';

describe('ReportsTable', () => {
  const mockReports = [
    {
      id: 1,
      descripcion: 'Foco de calor detectado',
      estado: 'PENDIENTE',
      prioridad: 'ALTA',
      fecha: '2026-05-09T10:00:00Z',
      coordenadas: { latitud: -33.4, longitud: -70.6 },
      tipoIncendio: 'Forestal',
      equipoAsignado: 'Brigada_Central'
    }
  ];

  it('debe mostrar un combobox (select) para editar el estado si es BRIGADISTA', () => {
    render(<ReportsTable reports={mockReports} rolUsuario="BRIGADISTA" onStatusChange={jest.fn()} />);
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement.value).toBe('PENDIENTE');
  });

  it('debe mostrar un texto estático (Badge) y NO un select si el rol es FUNCIONARIO', () => {
    render(<ReportsTable reports={mockReports} rolUsuario="FUNCIONARIO" onStatusChange={jest.fn()} />);
    
    const selectElement = screen.queryByRole('combobox');
    expect(selectElement).not.toBeInTheDocument(); 
    expect(screen.getByText('PENDIENTE')).toBeInTheDocument(); 
  });
});