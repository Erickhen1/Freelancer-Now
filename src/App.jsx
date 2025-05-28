import React, { useState } from 'react';
    import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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

    const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/95f580e9-5bc3-47bc-920d-5a87439161c0/45c0b51c300548a9e8790c65cd8f60a2.png";

    const Navbar = () => {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <img src={logoUrl} alt="Freelancer Now Logo" className="mr-2 h-10 w-10 rounded-md object-contain" />
              Freelancer Now
            </Link>
            
            <div className="hidden md:flex space-x-1 items-center">
              {navItems.map((item) => (
                <Button key={item.name} variant="ghost" className="text-white hover:bg-sky-600 hover:text-white px-3 py-2 text-sm" asChild>
                  <Link to={item.path}>{item.icon}{item.name}</Link>
                </Button>
              ))}
              <Button variant="secondary" className="bg-white text-sky-700 hover:bg-gray-100 px-3 py-2 text-sm" asChild>
                <Link to="/login"><LogIn className="mr-2 h-5 w-5" />Login</Link>
              </Button>
              <Button className="bg-amber-400 text-sky-800 hover:bg-amber-500 px-3 py-2 text-sm" asChild>
                <Link to="/cadastro"><UserPlus className="mr-2 h-5 w-5" />Cadastre-se</Link>
              </Button>
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

    const HeroSection = () => (
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-sky-500 to-sky-700 text-white py-20 px-4 text-center"
      >
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <img src={logoUrl} alt="Freelancer Now Logo Grande" className="mx-auto h-24 w-24 md:h-32 md:w-32 rounded-2xl shadow-lg border-2 border-white object-contain" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold mb-6"
          >
            Conectando Talentos e Oportunidades
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
          >
            A plataforma ideal para bares, restaurantes e hotéis encontrarem freelancers qualificados. Garçons, cozinheiros, bartenders e mais!
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center justify-center"
          >
            <Button size="lg" className="w-full sm:w-auto bg-amber-400 text-sky-800 hover:bg-amber-500" asChild>
              <Link to="/buscar-vagas"><Search className="mr-2 h-5 w-5" />Buscar Vagas</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-sky-700 mt-4 sm:mt-0" 
              asChild
            >
              <Link to="/publicar-vaga"><PlusCircle className="mr-2 h-5 w-5" />Publicar Vaga</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    );

    const FeatureCard = ({ icon, title, description, delay }) => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center h-full border border-sky-100"
      >
        <div className="text-sky-600 mb-4">{React.cloneElement(icon, { size: 48 })}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
      </motion.div>
    );

    const FeaturesSection = () => (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<img src={logoUrl} alt="Ícone Empresas" className="h-12 w-12 opacity-80 object-contain" />} 
              title="Para Empresas" 
              description="Publique vagas rapidamente e encontre os melhores freelancers para o seu estabelecimento. Visualize perfis detalhados e avaliações."
              delay={0.2}
            />
            <FeatureCard 
              icon={<UserPlus />} 
              title="Para Freelancers" 
              description="Cadastre-se, crie seu perfil profissional destacando sua experiência e área de atuação. Encontre oportunidades incríveis."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Star />} 
              title="Avaliações Transparentes" 
              description="Sistema de avaliação mútua para construir confiança e garantir a qualidade dos serviços prestados e das contratações."
              delay={0.6}
            />
          </div>
        </div>
      </section>
    );
    
    const CtaSection = () => (
      <section className="py-16 bg-sky-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Junte-se à Freelancer Now e transforme a maneira como você contrata ou encontra trabalho no setor de hospitalidade.
          </p>
          <Button size="lg" className="bg-amber-400 text-sky-800 hover:bg-amber-500" asChild>
            <Link to="/cadastro"><UserPlus className="mr-2 h-5 w-5" />Cadastre-se Gratuitamente</Link>
          </Button>
        </div>
      </section>
    );

    const Footer = () => (
      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <Link to="/termos" className="text-sm hover:text-amber-400 transition-colors">Termos e Condições</Link>
            <span className="mx-2 text-slate-500">|</span>
            <Link to="/privacidade" className="text-sm hover:text-amber-400 transition-colors">Política de Privacidade</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Freelancer Now. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Conectando você ao seu próximo trabalho ou talento.</p>
        </div>
      </footer>
    );
    
    const HomePage = () => (
      <>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </>
    );

    const PlaceholderPage = ({ title, icon, message, showImage = true }) => {
      const { toast } = useToast();
      React.useEffect(() => {
        toast({
          title: "Página Carregada",
          description: `Você está na página "${title}".`,
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
              class="mx-auto rounded-lg shadow-lg w-full max-w-sm h-auto mb-8"
              alt={`Ilustração para a página ${title}`} src="https://images.unsplash.com/photo-1525265217476-9616bff67723" />
          )}
          <Button className="bg-sky-600 hover:bg-sky-700 text-white" asChild>
            <Link to="/"><Home className="mr-2 h-5 w-5" />Voltar para Home</Link>
          </Button>
        </motion.div>
      );
    };

    function App() {
      return (
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
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