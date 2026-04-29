import { AppProviders } from "./app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer theme="colored" />
      <AppProviders />
    </>
  );
};

export default App;
