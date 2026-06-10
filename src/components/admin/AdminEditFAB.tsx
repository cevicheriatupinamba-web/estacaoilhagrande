import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

/**
 * Discreet floating "Editar anúncio" button shown only to Admin/Super Admin
 * on public pages. Sends the user to the admin global editor pre-filtered.
 */
export default function AdminEditFAB({
  source,
  id,
  label = "Editar anúncio",
}: {
  source: "listings" | "accommodations";
  id?: string | null;
  label?: string;
}) {
  const { isAdmin } = useAuth();
  if (!isAdmin || !id) return null;
  return (
    <Link
      to={`/admin/editar-anuncios?source=${source}&id=${id}&edit=1`}
      className="fixed bottom-24 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold shadow-lg hover:bg-slate-800 transition"
    >
      <Pencil className="w-4 h-4" /> {label}
    </Link>
  );
}
