import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SeguimientoPage } from "./SeguimientoPage";
import { BrowserRouter } from "react-router-dom";

global.fetch = jest.fn();

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <SeguimientoPage />
    </BrowserRouter>
  );
};

describe("SeguimientoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar correctamente el input y el botón", () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText(/Ej: ABC123XY/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Buscar/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Estado de tu Reporte/i)).toBeInTheDocument();
  });

  it("debe mostrar error si el código está vacío", async () => {
    renderComponent();

    const form = screen.getByRole("button", { name: /Buscar/i }).closest("form");
    fireEvent.submit(form);

    expect(await screen.findByText(/Ingrese un código\./i)).toBeInTheDocument();
  });

  it("debe buscar correctamente y mostrar el reporte", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        estado: "EN_PROCESO",
        tipoIncendio: "Forestal",
        fechaReporte: "2026-06-01T10:00:00Z",
        descripcion: "Incendio en zona rural",
      }),
    });

    renderComponent();

    const input = screen.getByPlaceholderText(/Ej: ABC123XY/i);

    fireEvent.change(input, { target: { value: "abc123xy" } });

    const form = screen.getByRole("button", { name: /Buscar/i }).closest("form");
    fireEvent.submit(form);

    expect(await screen.findByText(/Estado:/i)).toBeInTheDocument();
    expect(screen.getByText(/EN_PROCESO/i)).toBeInTheDocument();
    expect(screen.getByText(/Incendio Forestal/i)).toBeInTheDocument();
    expect(screen.getByText(/Incendio en zona rural/i)).toBeInTheDocument();
  });

  it("debe mostrar error 404 cuando el código no existe", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    renderComponent();

    const input = screen.getByPlaceholderText(/Ej: ABC123XY/i);
    fireEvent.change(input, { target: { value: "noexiste12" } });

    const form = screen.getByRole("button", { name: /Buscar/i }).closest("form");
    fireEvent.submit(form);

    expect(
      await screen.findByText(/Código no encontrado\./i)
    ).toBeInTheDocument();
  });

  it("debe mostrar error de servidor si falla la API", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderComponent();

    const input = screen.getByPlaceholderText(/Ej: ABC123XY/i);
    fireEvent.change(input, { target: { value: "error500" } });

    const form = screen.getByRole("button", { name: /Buscar/i }).closest("form");
    fireEvent.submit(form);

    expect(
      await screen.findByText(/Error en el servidor\./i)
    ).toBeInTheDocument();
  });
});