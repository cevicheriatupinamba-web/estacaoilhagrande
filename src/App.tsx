import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Explorar from "./pages/Explorar";
import LugarDetalhe from "./pages/LugarDetalhe";
import Roteiros from "./pages/Roteiros";
import Dicas from "./pages/Dicas";
import NaoFazer from "./pages/NaoFazer";
import Anuncie from "./pages/Anuncie";
import AuthForm from "./pages/AuthForm";
import Favoritos from "./pages/Favoritos";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import Hospedagem from "./pages/Hospedagem";
import OndeComer from "./pages/OndeComer";
import Passeios from "./pages/Passeios";
import Diversao from "./pages/Diversao";
import Praias from "./pages/Praias";
import Trilhas from "./pages/Trilhas";
import VidaNoturna from "./pages/VidaNoturna";
import Transporte from "./pages/Transporte";
import Guias from "./pages/Guias";
import OQueFazer from "./pages/OQueFazer";
import CadastroEmpresa from "./pages/CadastroEmpresa";
import PainelAnunciante from "./pages/PainelAnunciante";
import EditarListagem from "./pages/EditarListagem";
import ListagemDetalhe from "./pages/ListagemDetalhe";
import Hostels from "./pages/Hostels";
import Camping from "./pages/Camping";
import Transfer from "./pages/Transfer";
import Eventos from "./pages/Eventos";
import Experiencias from "./pages/Experiencias";
import ComercioLocal from "./pages/ComercioLocal";
import MelhorEpoca from "./pages/MelhorEpoca";
import ProgrammaticPage from "./pages/ProgrammaticPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import EmpresaRedirect from "./pages/EmpresaRedirect";
import Servicos from "./pages/Servicos";
import StaticDetalhe from "./pages/StaticDetalhe";
import LopesMendes from "./pages/LopesMendes";
import NotFound from "./pages/NotFound";
import AgenciaOficial from "./pages/AgenciaOficial";

import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCRM from "./pages/admin/CRM";
import AdminLeads from "./pages/admin/Leads";
import AdminContent from "./pages/admin/Content";
import AdminActivity from "./pages/admin/ActivityLog";
import AdminRoles from "./pages/admin/Roles";
import AdminInvites from "./pages/admin/Invites";
import AdminPlans from "./pages/admin/Plans";
import AdminSettings from "./pages/admin/Settings";
import AdminUsers from "./pages/admin/Users";
import ImportarPousada from "./pages/admin/ImportarPousada";
import AdminFinanceiro from "./pages/admin/Financeiro";
import PousadaDetalhe from "./pages/PousadaDetalhe";
import Faturas from "./pages/advertiser/Faturas";
import InviteAccept from "./pages/InviteAccept";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import AdvertiserLayout from "@/components/advertiser/AdvertiserLayout";
import AdvertiserDashboard from "./pages/advertiser/Dashboard";
import MinhaEmpresa from "./pages/advertiser/MinhaEmpresa";
import MinhaAssinatura from "./pages/advertiser/MinhaAssinatura";
import CustomerLayout from "@/components/customer/CustomerLayout";
import CustomerPerfil from "./pages/customer/Perfil";
import CustomerFavoritos from "./pages/customer/Favoritos";
import CustomerHistorico from "./pages/customer/Historico";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explorar" element={<Explorar />} />
              <Route path="/lugar/:slug" element={<LugarDetalhe />} />

              {/* Hospedagem */}
              <Route path="/hospedagem" element={<Hospedagem />} />
              <Route path="/hospedagens" element={<Hospedagem />} />
              <Route path="/hospedagens-ilha-grande" element={<Hospedagem />} />
              <Route path="/onde-se-hospedar" element={<Hospedagem />} />
              <Route path="/onde-ficar-em-ilha-grande" element={<Hospedagem />} />
              <Route path="/pousadas-em-ilha-grande" element={<Hospedagem />} />
              <Route path="/hoteis-em-ilha-grande" element={<Hospedagem />} />
              <Route path="/hostels-em-ilha-grande" element={<Hostels />} />
              <Route path="/hostels-ilha-grande" element={<Hostels />} />
              <Route path="/camping-ilha-grande" element={<Camping />} />
              <Route path="/camping-em-ilha-grande" element={<Camping />} />

              {/* Gastronomia */}
              <Route path="/onde-comer" element={<OndeComer />} />
              <Route path="/restaurantes" element={<OndeComer />} />
              <Route path="/restaurantes-ilha-grande" element={<OndeComer />} />
              <Route path="/restaurantes-em-ilha-grande" element={<OndeComer />} />
              <Route path="/onde-comer-em-ilha-grande" element={<OndeComer />} />

              {/* Experiências */}
              <Route path="/passeios" element={<Passeios />} />
              <Route path="/passeios-ilha-grande" element={<Passeios />} />
              <Route path="/passeios-em-ilha-grande" element={<Passeios />} />
              <Route path="/o-que-fazer" element={<OQueFazer />} />
              <Route path="/o-que-fazer-em-ilha-grande" element={<OQueFazer />} />
              <Route path="/praias" element={<Praias />} />
              <Route path="/praias-de-ilha-grande" element={<Praias />} />
              <Route path="/praias/lopes-mendes" element={<LopesMendes />} />
              <Route path="/lopes-mendes" element={<LopesMendes />} />
              <Route path="/trilhas" element={<Trilhas />} />
              <Route path="/trilhas-em-ilha-grande" element={<Trilhas />} />
              <Route path="/vida-noturna" element={<VidaNoturna />} />
              <Route path="/experiencias" element={<Experiencias />} />
              <Route path="/experiencias-ilha-grande" element={<Experiencias />} />

              {/* Eventos / Comércio local */}
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/eventos-ilha-grande" element={<Eventos />} />
              <Route path="/comercio-local" element={<ComercioLocal />} />
              <Route path="/comercio-local-ilha-grande" element={<ComercioLocal />} />

              {/* Transporte */}
              <Route path="/transporte" element={<Transporte />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/transfer-ilha-grande" element={<Transfer />} />
              <Route path="/como-chegar-em-ilha-grande" element={<Transporte />} />
              <Route path="/guias" element={<Guias />} />

              {/* Planejamento */}
              <Route path="/melhor-epoca-para-visitar-ilha-grande" element={<MelhorEpoca />} />

              {/* Páginas programáticas (long-tail) */}
              <Route path="/pousadas-com-cafe-da-manha-ilha-grande" element={<ProgrammaticPage />} />
              <Route path="/pousadas-pet-friendly-ilha-grande" element={<ProgrammaticPage />} />
              <Route path="/pousadas-baratas-ilha-grande" element={<ProgrammaticPage />} />
              <Route path="/restaurantes-beira-mar-ilha-grande" element={<ProgrammaticPage />} />
              <Route path="/passeios-de-lancha-ilha-grande" element={<ProgrammaticPage />} />
              <Route path="/passeios-para-lopes-mendes" element={<ProgrammaticPage />} />
              <Route path="/onde-comer-frutos-do-mar-em-ilha-grande" element={<ProgrammaticPage />} />
              <Route path="/transfer-rio-para-ilha-grande" element={<ProgrammaticPage />} />
              <Route path="/transfer-conceicao-de-jacarei-para-ilha-grande" element={<ProgrammaticPage />} />

              {/* Blog */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Empresa (alias SEO) */}
              <Route path="/empresa/:slug" element={<EmpresaRedirect />} />

              {/* Serviços (hub comercial) */}
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/servicos-ilha-grande" element={<Servicos />} />

              <Route path="/diversao" element={<Diversao />} />
              <Route path="/roteiros" element={<Roteiros />} />
              <Route path="/roteiros/:slug" element={<StaticDetalhe categoryKey="roteiros" />} />
              <Route path="/dicas" element={<Dicas />} />
              <Route path="/dicas/:slug" element={<StaticDetalhe categoryKey="dicas" />} />
              <Route path="/nao-fazer" element={<NaoFazer />} />
              <Route path="/anuncie" element={<Anuncie />} />
              <Route path="/agencia-oficial" element={<AgenciaOficial />} />
              <Route path="/agencia" element={<AgenciaOficial />} />

              {/* Páginas individuais — categorias estáticas */}
              <Route path="/onde-comer/:slug" element={<StaticDetalhe categoryKey="onde-comer" />} />
              <Route path="/onde-se-hospedar/:slug" element={<StaticDetalhe categoryKey="onde-se-hospedar" />} />
              <Route path="/passeios/:slug" element={<StaticDetalhe categoryKey="passeios" />} />
              <Route path="/servicos/:slug" element={<StaticDetalhe categoryKey="servicos" />} />

              <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />
              <Route path="/painel-anunciante" element={<PainelAnunciante />} />
              <Route path="/painel-anunciante/editar/:id" element={<EditarListagem />} />
              <Route path="/listagem/:slug" element={<ListagemDetalhe />} />
              <Route path="/pousadas/:slug" element={<PousadaDetalhe />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/login" element={<AuthForm mode="login" />} />
              <Route path="/cadastro" element={<AuthForm mode="signup" />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />
              <Route path="/redefinir-senha" element={<RedefinirSenha />} />
              <Route path="/admin-legacy" element={<Admin />} />

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Public invite acceptance */}
            <Route path="/invite/:token" element={<InviteAccept />} />

            {/* Admin platform (own layout, no public navbar/footer) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="importar-pousada" element={<ImportarPousada />} />
              <Route path="anunciantes" element={<AdminCRM />} />
              <Route path="financeiro" element={<AdminFinanceiro />} />
              <Route path="solicitacoes" element={<AdminLeads />} />
              <Route path="conteudo" element={<AdminContent />} />
              <Route path="convites" element={<AdminInvites />} />
              <Route path="permissoes" element={<AdminRoles />} />
              <Route path="planos" element={<AdminPlans />} />
              <Route path="configuracoes" element={<AdminSettings />} />
              <Route path="auditoria" element={<AdminActivity />} />
              {/* legacy aliases */}
              <Route path="crm" element={<Navigate to="/admin/anunciantes" replace />} />
              <Route path="leads" element={<Navigate to="/admin/solicitacoes" replace />} />
              <Route path="content" element={<Navigate to="/admin/conteudo" replace />} />
              <Route path="roles" element={<Navigate to="/admin/permissoes" replace />} />
              <Route path="activity" element={<Navigate to="/admin/auditoria" replace />} />
              <Route path="assinaturas" element={<Navigate to="/admin/financeiro" replace />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* Advertiser extranet — only routes with real backend */}
            <Route element={<AdvertiserLayout />}>
              <Route path="/dashboard" element={<AdvertiserDashboard />} />
              <Route path="/minha-empresa" element={<MinhaEmpresa />} />
              <Route path="/minha-assinatura" element={<MinhaAssinatura />} />
              <Route path="/financeiro" element={<MinhaAssinatura />} />
              <Route path="/financeiro/faturas" element={<Faturas />} />
            </Route>

            {/* Customer (turista) area */}
            <Route path="/minha-conta" element={<CustomerLayout />}>
              <Route index element={<CustomerPerfil />} />
              <Route path="favoritos" element={<CustomerFavoritos />} />
              <Route path="historico" element={<CustomerHistorico />} />
            </Route>
          </Routes>
        </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

