import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { themedImage } from "@/lib/images";

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category_slug: string | null;
  reading_minutes: number | null;
  seo_title: string | null;
  seo_description: string | null;
  keywords: string | null;
  author: string | null;
  published_at: string;
}

const BlogPost = () => {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      setPost((data as Post) || null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="container py-32 text-center">Carregando…</div>;
  if (!post) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display font-bold text-3xl mb-3">Artigo não encontrado</h1>
        <Link to="/blog" className="text-primary font-semibold">Voltar ao blog</Link>
      </div>
    );
  }

  const cover = post.cover_image || themedImage("nature", post.slug);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: [cover],
    datePublished: post.published_at,
    author: { "@type": "Organization", name: post.author || "Estação Ilha Grande" },
    publisher: { "@type": "Organization", name: "Estação Ilha Grande" },
    description: post.excerpt || post.seo_description,
  };

  return (
    <>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || post.title}
        path={`/blog/${post.slug}`}
        keywords={post.keywords || undefined}
        type="article"
        image={cover}
        jsonLd={[articleLd]}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <section className="relative h-[44vh] min-h-[320px] overflow-hidden">
        <img src={cover} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 to-foreground/80" />
        <div className="relative z-10 container h-full flex flex-col justify-end pb-12 text-primary-foreground">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm mb-3 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao blog
          </Link>
          {post.category_slug && (
            <span className="text-[10px] font-bold tracking-widest uppercase text-sun mb-2">
              {post.category_slug.replace(/-/g, " ")}
            </span>
          )}
          <h1 className="font-display font-black text-4xl md:text-6xl max-w-4xl drop-shadow-lg">{post.title}</h1>
          <div className="flex items-center gap-3 mt-3 text-sm text-primary-foreground/80">
            <span>{post.author || "Estação Ilha Grande"}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.reading_minutes || 5} min de leitura</span>
          </div>
        </div>
      </section>

      <article className="container max-w-3xl py-12 prose prose-lg">
        {post.excerpt && <p className="text-xl text-foreground/80 leading-relaxed mb-8">{post.excerpt}</p>}
        <div className="text-foreground/85 leading-relaxed whitespace-pre-line">{post.content || "Conteúdo em produção."}</div>
      </article>
    </>
  );
};

export default BlogPost;
