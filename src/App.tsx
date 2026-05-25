import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
              <Route path="/roteiros" element={<Roteiros />} />
              <Route path="/dicas" element={<Dicas />} />
              <Route path="/nao-fazer" element={<NaoFazer />} />
              <Route path="/anuncie" element={<Anuncie />} />
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
