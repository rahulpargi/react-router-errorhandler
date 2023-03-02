import { RouterProvider, createMemoryRouter, json } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { render, waitFor, screen, act } from "@testing-library/react";
import TestPage from "./TestPage";
import { ErrorResponse } from "./ErrorResponse";

test("Error Page", async () => {
  const routes = [
    {
      path: "/app",
      errorElement: <ErrorPage />,
      element: <TestPage />,
      loader: async ({ params }) => {
        throw new ErrorResponse(
          500,
          "Not Found",
          { message: "Invalid route" },
          true
        );
      },
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/app"],
  });

  act(() => render(<RouterProvider router={router} />));
  await waitFor(() => {
    expect(screen.getByText(/500/i)).toBeInTheDocument();
    expect(screen.getByText(/oops!/i)).toBeInTheDocument();
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid route/i)).toBeInTheDocument();
  });
});

test("Error Page 1", async () => {
  const routes = [
    {
      path: "/app",
      errorElement: <ErrorPage />,
      element: <TestPage />,
      loader: async ({ params }) => {
        throw new Response("Sorry the requested resource is not found", {
          status: 404,
        });
      },
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/app"],
  });

  act(() => render(<RouterProvider router={router} />));
  await waitFor(() => {
    expect(screen.getByText(/oops/i)).toBeInTheDocument();
  });
});
