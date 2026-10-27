import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CtaBand, PageHero, SiteFooter } from "@/components/sections";
import { POSTS } from "@/lib/blog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Blog — ELO Saúde Integrada" },
      {
        name: "description",
        content:
          "Conteúdo sobre autismo, desenvolvimento infantil, terapias e convênios, escrito para famílias de Aracaju.",
      },
      { property: "og:title", content: "Blog — ELO Saúde Integrada" },
      {
        property: "og:description",
        content: "Informação para famílias sobre TEA, terapias e convênios.",
      },
    ],
  }),
  component: Blog,
});

function Blog() {
  const categories = ["Todos", ...Array.from(new Set(POSTS.map((post) => post.category)))];
  const [category, setCategory] = useState("Todos");
  const posts = category === "Todos" ? POSTS : POSTS.filter((post) => post.category === category);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageHero
        eyebrow="Blog"
        title="Informação para decidir com segurança"
        sub="Conteúdo sobre desenvolvimento, autismo, terapias e convênios. O blog atual continua no WordPress — este modelo mostra como a leitura ficaria dentro do novo site."
      />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition",
                category === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                {post.category}
              </span>
              <h2 className="mt-2 font-display text-xl leading-snug">
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                {post.date} · {post.readingTime} de leitura
              </p>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Ler artigo <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">Nenhum artigo nesta categoria.</p>
        )}
      </section>

      <CtaBand
        title="Ficou com dúvida sobre o seu caso?"
        text="Conteúdo informativo não substitui avaliação. Fale com a equipe da ELO."
      />
      <SiteFooter />
    </div>
  );
}
