import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import JobSearchPage from "./pages/JobSearchPage";
import PostJobPage from "./pages/PostJobPage";
import ProfilePage from "./pages/ProfilePage";
import ReviewsPage from "./pages/ReviewsPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import TermsPage from "./pages/TermsPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-sky-500 to-sky-700 p-4 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white flex items-center">
              Freelancer Now
            </Link>

            <div className="hidden md:flex space-x-1 items-center">
              <Link
                to="/buscar-vagas"
                className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors hover:bg-sky-600 hover:text-white px-3 py-2 text-sm text-white"
              >
                Buscar Vagas
              </Link>

              <Link
                to="/publicar-vaga"
                className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors hover:bg-sky-600 hover:text-white px-3 py-2 text-sm text-white"
              >
                Publicar Vaga
              </Link>

              <Link
                to="/avaliacoes"
                className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors hover:bg-sky-600 hover:text-white px-3 py-2 text-sm text-white"
              >
                Avaliações
              </Link>

              <Link
                to="/perfil"
                className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors hover:bg-sky-600 hover:text-white px-3 py-2 text-sm text-white"
              >
                Meu Perfil
              </Link>

              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-md bg-white text-sky-700 font-medium hover:bg-gray-100 px-3 py-2 text-sm"
                  >
                    Login
                  </Link>

                  <Link
                    to="/cadastro"
                    className="inline-flex items-center justify-center rounded-md bg-amber-400 text-sky-800 font-medium hover:bg-amber-500 px-3 py-2 text-sm"
                  >
                    Cadastre-se
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-md bg-red-500 text-white font-medium hover:bg-red-600 px-3 py-2 text-sm"
                >
                  Sair
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Conteúdo principal */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/buscar-vagas" element={<JobSearchPage />} />
            <Route path="/publicar-vaga" element={<PostJobPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/avaliacoes" element={<ReviewsPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/cadastro" element={<RegistrationPage />} />
            <Route path="/termos" element={<TermsPage />} />
          </Routes>
        </main>

        <Toaster />
      </div>
    </Router>
  );
}

export default App;
