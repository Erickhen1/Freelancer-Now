import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Star, LogIn, UserCircle, Search, PlusCircle, Home, FileText, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import RegistrationPage from '@/pages/RegistrationPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import JobSearchPage from '@/pages/JobSearchPage.jsx';
import PostJobPage from '@/pages/PostJobPage.jsx';
import ReviewsPage from '@/pages/ReviewsPage.jsx';
import TermsPage from '@/pages/TermsPage.jsx';

// Definindo o Componente HomePage
const HomePage = () => (
  <>
    <HeroSection />
    <FeaturesSection />
    <CtaSection />
  </>
);

// Definindo o Componente PlaceholderPage
const PlaceholderPage = ({ title, icon, message, showImage = true }) => {
  const { toast } = useToast();
  React.useEffect(() => {
    toast({
      title: "Página Carregada",
      description: Você está na página "${title}".,
      variant: "default",
    });
  }, [title, toast]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-16 px-4 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
    >
      <div className="text-sky-600 mb-6">
        {React.cloneElement(icon, { size: 64, strokeWidth: 1.5 })}
      </div>
      <h1 className="text-4xl font-bold text-sky-700 mb-4">{title}</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        {message || "Esta seção está em desenvolvimento. Volte em breve para conferir as novidades!"}
      </p>
      {showImage && (
        <img    
          className="mx-auto rounded-lg shadow-lg w-full max-w-sm h-auto mb-8"
          alt={Ilustração para a página ${title}} src="https://images.unsplash.com/photo-1525265217476-9616bff67723" />
      )}
      <Button className="bg-sky-600 hover:bg-sky-700 text-white" asChild>
        <Link to="/"><Home className="mr-2 h-5 w-5" />Voltar para Home</Link>
      </Button>
    </motion.div>
  );
};

const logoUrl = "https://drive.google.com/uc?export=view&id=1lGIZ_seup5QCP2pinGNEJgBoCgBVnFPA";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();  // Hook para pegar a URL atual

  // Condicional para não mostrar os botões de login e cadastro na homepage
  const isHomePage = location.pathname === '/';

  const navItems = [
    { name: 'Buscar Vagas', path: '/buscar-vagas', icon: <Search className="mr-2 h-5 w-5" /> },
    { name: 'Publicar Vaga', path: '/publicar-vaga', icon: <PlusCircle className="mr-2 h-5 w-5" /> },
    { name: 'Meu Perfil', path: '/perfil', icon: <UserCircle className="mr-2 h-5 w-5" /> },
    { name: 'Avaliações', path: '/avaliacoes', icon: <Star className="mr-2 h-5 w-5" /> },
  ];

  const mobileNavItems = [
    ...navItems,
    { name: 'Login', path: '/login', icon: <LogIn className="mr-2 h-5 w-5" /> },
    { name: 'Cadastre-se', path: '/cadastro', icon: <UserPlus className="mr-2 h-5 w-5" /> },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-sky-500 to-sky-700 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white flex items-center">
          <img src="/logo-freelancer-now.png" alt="Freelancer Now Logo" className="mr-2 h-10 w-10 rounded-md object-contain" />
          Freelancer Now
        </Link>
        
        <div className="hidden md:flex space-x-1 items-center">
          {navItems.map((item) => (
            <Button key={item.name} variant="ghost" className="text-white hover:bg-sky-600 hover:text-white px-3 py-2 text-sm" asChild>
              <Link to={item.path}>{item.icon}{item.name}</Link>
            </Button>
          ))}
          
          {/* Só exibe os botões de login e cadastro se NÃO estiver na página inicial */}
          {!isHomePage && (
            <>
              <Button variant="secondary" className="bg-white text-sky-700 hover:bg-gray-100 px-3 py-2 text-sm" asChild>
                <Link to="/login"><LogIn className="mr-2 h-5 w-5" />Login</Link>
              </Button>
              <Button className="bg-amber-400 text-sky-800 hover:bg-amber-500 px-3 py-2 text-sm" asChild>
                <Link to="/cadastro"><UserPlus className="mr-2 h-5 w-5" />Cadastre-se</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button onClick={toggleMobileMenu} variant="ghost" size="icon" className="text-white hover:bg-sky-600">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-3 bg-sky-600 rounded-md shadow-xl overflow-hidden"
          >
            <ul className="flex flex-col space-y-1 p-2">
              {mobileNavItems.map((item) => (
                <li key={item.name}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-sky-500 hover:text-white text-base py-3" 
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={item.path}>{item.icon}{item.name}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Componentes como HeroSection, FeaturesSection, etc. continuam os mesmos.

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Rota para HomePage */}
            <Route path="/buscar-vagas" element={<JobSearchPage />} />
            <Route path="/publicar-vaga" element={<PostJobPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/avaliacoes" element={<ReviewsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegistrationPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route 
              path="/privacidade" 
              element={
                <PlaceholderPage 
                  title="Política de Privacidade" 
                  icon={<FileText />} 
                  message="Detalhes sobre como lidamos com seus dados estarão disponíveis aqui em breve."
                />
              } 
            />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
