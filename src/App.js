import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "./pages/Main";
import MapComponent from"./pages/MapComponent"
function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/map" element={<MapComponent />} />
        <Route path="/" element={<Main/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
