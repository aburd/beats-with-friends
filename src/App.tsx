import type { Component } from "solid-js";
import "./App.css";
import "./audio";
import TurnModePage from "./pages/TurnModePage";

const App: Component = () => {
  return (
    <div class="App">
      <TurnModePage />
    </div>
  );
};

export default App;
