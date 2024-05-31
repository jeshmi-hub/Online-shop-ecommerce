import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import Pages from "./components/Pages";
import Home from "./components/Pages/Home";
import { DataProvider } from "./GlobalState";


function App() {
  return (
    <>
   <DataProvider>
    <BrowserRouter>
    <div className="App">
      <Home/>
      <Pages/>
    </div>
    </BrowserRouter>
    </DataProvider>

    </>
  );
}

export default App;
