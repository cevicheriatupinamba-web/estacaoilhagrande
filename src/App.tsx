import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
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
import ListagemDetalhe from "./pages/ListagemDetalhe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explorar" element={<Explorar />} />
              <Route path="/lugar/:slug" element={<LugarDetalhe />} />

              {/* Hospedagem (com alias) */}
              <Route path="/hospedagem" element={<Hospedagem />} />
              <Route path="/onde-se-hospedar" element={<Hospedagem />} />

              {/* Gastronomia */}
              <Route path="/onde-comer" element={<OndeComer />} />
              <Route path="/restaurantes" element={<OndeComer />} />

              {/* Experiências */}
              <Route path="/passeios" element={<Passeios />} />
              <Route path="/o-que-fazer" element={<OQueFazer />} />
              <Route path="/praias" element={<Praias />} />
              <Route path="/trilhas" element={<Trilhas />} />
              <Route path="/vida-noturna" element={<VidaNoturna />} />
              <Route path="/transporte" element={<Transporte />} />
              <Route path="/guias" element={<Guias />} />

              <Route path="/diversao" element={<Diversao />} />
              <Route path="/roteiros" element={<Roteiros />} />
              <Route path="/dicas" element={<Dicas />} />
              <Route path="/nao-fazer" element={<NaoFazer />} />
              <Route path="/anuncie" element={<Anuncie />} />
              <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />
              <Route path="/painel-anunciante" element={<PainelAnunciante />} />
              <Route path="/listagem/:slug" element={<ListagemDetalhe />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/login" element={<AuthForm mode="login" />} />
              <Route path="/cadastro" element={<AuthForm mode="signup" />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
