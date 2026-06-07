import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { themedImage } from "@/lib/images";

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  category_slug: string | null;
  reading_minutes: number | null;
  published_at: string;
}

interface Category {
  slug: string;
  name: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [cat, setCat] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from("blog_categories").select("slug,name").order("name");
      setCats(c || []);
      const q = supabase
        .from("blog_posts")
        .select("slug,title,excerpt,cover_image,category_slug,reading_minutes,published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      const { data } = cat ? await q.eq("category_slug", cat) : await q;
      setPosts((data as Post[]) || []);
    })();
  }, [cat]);

  return (
    <>
      <SEO
        title="Blog Estação Ilha Grande — Guias, dicas e roteiros"
        description="Blog oficial da Estação Ilha Grande: guias de praias, trilhas, roteiros de 3 e 5 dias, dicas para mochileiros, casais e famílias."
        path="/blog"
        keywords="blog ilha grande, guias ilha grande, dicas ilha grande, roteiro ilha grande, viagem ilha grande"
      />

      <section className="relative h-[36vh] min-h-[280px] overflow-hidden">
        <img src={themedImage("hike", "blog-hero")} alt="Blog Estação Ilha Grande" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 to-foreground/80" />
        <div className="relative z-10 container h-full flex flex-col justify-end pb-10 text-primary-foreground">
          <span className="text-xs font-bold tracking-widest text-sun uppercase mb-2">Blog Estação Ilha Grande</span>
          <h1 className="font-display font-black text-4xl md:text-6xl">Guias, dicas e roteiros de Ilha Grande</h1>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setCat("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${!cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}>
            Todas
          </button>
          {cats.map(c => (
            <button key={c.slug} onClick={() => setCat(c.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${cat === c.slug ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}>
              {c.name}
            </button>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`}
                className="group bg-card rounded-3xl overflow-hidden border border-border/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.cover_image || themedImage("hike", p.slug)} alt={p.title}
                    loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  {p.category_slug && (
                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary">{p.category_slug.replace(/-/g, " ")}</span>
                  )}
                  <h2 className="font-display font-bold text-xl mb-2 mt-1 line-clamp-2">{p.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {p.reading_minutes || 5} min</span>
                    <span className="inline-flex items-center gap-1 text-primary font-semibold">Ler <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Blog;
