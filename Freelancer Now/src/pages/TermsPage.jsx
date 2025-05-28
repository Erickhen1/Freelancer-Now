import React from 'react';
    import { motion } from 'framer-motion';
    import { FileText, Shield, Users, AlertTriangle, Home } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';

    const TermsPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-12 px-4"
        >
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-blue-100">
            <header className="mb-10 text-center">
              <FileText className="mx-auto text-blue-600 h-16 w-16 mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Termos e Condições</h1>
              <p className="text-gray-600 mt-2">Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <section className="space-y-6 text-gray-700 prose prose-blue max-w-none">
              <h2 className="text-2xl font-semibold text-blue-600 flex items-center"><Users className="mr-3 h-7 w-7" /> 1. Aceitação dos Termos</h2>
              <p>Bem-vindo à Freelancer Now! Ao acessar ou usar nossa plataforma, você concorda em estar vinculado por estes Termos e Condições ("Termos") e nossa Política de Privacidade. Se você não concordar com qualquer parte dos termos, então você não tem permissão para acessar o serviço.</p>

              <h2 className="text-2xl font-semibold text-blue-600 flex items-center"><Shield className="mr-3 h-7 w-7" /> 2. Descrição do Serviço</h2>
              <p>Freelancer Now é uma plataforma online que conecta estabelecimentos como bares, restaurantes e hotéis ("Empresas") com profissionais freelancers qualificados ("Freelancers") para oportunidades de trabalho temporário em áreas como garçom, cozinheiro, bartender, e auxiliares. Não somos uma agência de empregos e não empregamos diretamente os Freelancers.</p>

              <h2 className="text-2xl font-semibold text-blue-600 flex items-center"><Users className="mr-3 h-7 w-7" /> 3. Contas de Usuário</h2>
              <p>Para acessar certas funcionalidades da plataforma, você deve se registrar e criar uma conta. Você concorda em fornecer informações precisas, atuais e completas durante o processo de registro e em atualizar tais informações para mantê-las precisas, atuais e completas. Reservamo-nos o direito de suspender ou encerrar sua conta se qualquer informação fornecida durante o processo de registro ou posteriormente se mostrar imprecisa, não atual ou incompleta.</p>
              <p>Você é responsável por proteger sua senha e por quaisquer atividades ou ações sob sua conta, quer você tenha autorizado ou não tais atividades ou ações.</p>
              
              <h2 className="text-2xl font-semibold text-blue-600 flex items-center"><FileText className="mr-3 h-7 w-7" /> 4. Conduta do Usuário</h2>
              <p>Você concorda em não usar a Plataforma para:</p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Publicar qualquer conteúdo que seja ilegal, prejudicial, ameaçador, abusivo, difamatório, vulgar, obsceno ou odioso.</li>
                <li>Personificar qualquer pessoa ou entidade, ou declarar falsamente ou de outra forma deturpar sua afiliação com uma pessoa ou entidade.</li>
                <li>Publicar ou transmitir qualquer material que contenha vírus de software ou qualquer outro código de computador, arquivos ou programas projetados para interromper, destruir ou limitar a funcionalidade de qualquer software ou hardware de computador ou equipamento de telecomunicações.</li>
                <li>Coletar ou armazenar dados pessoais sobre outros usuários sem o seu consentimento expresso.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-blue-600 flex items-center"><AlertTriangle className="mr-3 h-7 w-7" /> 5. Isenção de Responsabilidade</h2>
              <p>A Plataforma é fornecida "COMO ESTÁ" e "COMO DISPONÍVEL", sem garantias de qualquer tipo, expressas ou implícitas. Freelancer Now não garante que a plataforma será ininterrupta, segura ou livre de erros. Não nos responsabilizamos pela qualidade dos serviços prestados pelos Freelancers nem pelas condições de trabalho oferecidas pelas Empresas.</p>
              <p>As interações entre Empresas e Freelancers são de sua exclusiva responsabilidade. Encorajamos ambas as partes a exercerem devida diligência.</p>

              <h2 className="text-2xl font-semibold text-blue-600 flex items-center"><FileText className="mr-3 h-7 w-7" /> 6. Limitação de Responsabilidade</h2>
              <p>Em nenhuma circunstância a Freelancer Now será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes de (i) seu acesso ou uso ou incapacidade de acessar ou usar o serviço; (ii) qualquer conduta ou conteúdo de terceiros no serviço; (iii) qualquer conteúdo obtido do serviço; e (iv) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo, seja com base em garantia, contrato, delito (incluindo negligência) ou qualquer outra teoria legal, quer tenhamos sido informados ou não da possibilidade de tais danos.</p>

              <h2 className="text-2xl font-semibold text-blue-600 flex items-center"><Shield className="mr-3 h-7 w-7" /> 7. Modificações dos Termos</h2>
              <p>Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso exclusivo critério.</p>
              <p>Ao continuar a acessar ou usar nossa Plataforma após essas revisões entrarem em vigor, você concorda em estar vinculado aos termos revisados.</p>

              <h2 className="text-2xl font-semibold text-blue-600 flex items-center"><Users className="mr-3 h-7 w-7" /> 8. Contato</h2>
              <p>Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco através do email: contato@freelancernow.com.br (este é um email fictício para fins de exemplo).</p>
            </section>

            <div className="mt-12 text-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link to="/"><Home className="mr-2 h-5 w-5" />Voltar para Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      );
    };

    export default TermsPage;