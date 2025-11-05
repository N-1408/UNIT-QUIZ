import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/app/providers";
import { appRouter } from "@/app/routes";

export const App = () => (
  <AppProviders>
    <RouterProvider router={appRouter} />
  </AppProviders>
);

export default App;
