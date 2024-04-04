import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import Home from "../home";
import Layout from "../../layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/App",
    element: <App />,
  },
]);

export default router;
