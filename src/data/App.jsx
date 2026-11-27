
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import SearchResults from "../pages/SearchResults.jsx";
import Chatbot from "../components/Chatbot.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
