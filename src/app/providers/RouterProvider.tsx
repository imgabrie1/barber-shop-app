import { RouterProvider as ReactRouterProvider } from "react-router-dom";
import { appRouter } from "../routes";

export const RouterProvider = () => {
  return <ReactRouterProvider router={appRouter} />;
};
