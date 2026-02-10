import { createBrowserRouter } from "react-router-dom";
import { privateRoutes } from "./private.routes";
import { publicRoutes } from "./public.routes";

export const appRouter = createBrowserRouter([publicRoutes, privateRoutes]);
