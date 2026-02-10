import { RouterProvider as ReactRouterProvider } from "react-router-dom";
import { appRouter } from "../routes";

export function RouterProvider() {
  return <ReactRouterProvider router={appRouter} />;
}
