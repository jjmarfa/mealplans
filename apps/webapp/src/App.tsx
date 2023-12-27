import { RouterProvider } from "react-router-dom";
import router from "./router";
import Config from "./Config";
import ModalHandler from "./components/ModalHandler";

function App() {
  return (
    <Config>
      <RouterProvider router={router} />
      <ModalHandler />
    </Config>
  );
}

export default App;
