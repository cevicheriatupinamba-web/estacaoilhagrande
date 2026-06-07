import { Navigate, useParams } from "react-router-dom";

// /empresa/:slug → /listagem/:slug (mantém URL bonita e SEO friendly)
const EmpresaRedirect = () => {
  const { slug = "" } = useParams();
  return <Navigate to={`/listagem/${slug}`} replace />;
};

export default EmpresaRedirect;
