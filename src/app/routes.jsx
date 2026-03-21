import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/login";
import { Tournaments } from "./pages/tournaments";
import { CreateTournament } from "./pages/create-tournament";
import { CreateAdmin } from "./pages/create-admin";
import { AddHP } from "./pages/add-hp";
import { Users } from "./pages/users";
import { DashboardLayout } from "./components/dashboard-layout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, element: <Navigate to="/tournaments" replace /> },
      { path: "tournaments", Component: Tournaments },
      { path: "tournaments/create", Component: CreateTournament },
      { path: "admins/create", Component: CreateAdmin },
      { path: "users", Component: Users },
      { path: "users/add-hp", Component: AddHP },
      { path: "*", element: <Navigate to="/tournaments" replace /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
], { basename: "/admin" });
