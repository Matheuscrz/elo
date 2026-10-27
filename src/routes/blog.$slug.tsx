import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BlogSection, CtaBand, SiteFooter } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { POSTS, postBySlug } from "@/lib/blog";
import { waLink } from "@/lib/clinic";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = postBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post ?? POSTS[0]!;
    return {
      meta: [
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: `${post.title} — ELO Saúde Integrada` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
      ],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para o blog
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {post.category}
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {post.date} · {post.readingTime} de leitura · Equipe ELO
        </p>
        <p className="mt-6 rounded-xl bg-secondary/70 p-4 text-xs text-muted-foreground">
          Conteúdo demonstrativo: o texto completo permanece no blog atual em WordPress e será
          migrado ou integrado na publicação.
        </p>

        <div className="mt-8 space-y-6">
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          {post.sections.map((section) => (
            <section key={section.heading ?? section.paragraphs[0]}>
              {section.heading && <h2 className="font-display text-2xl">{section.heading}</h2>}
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex-1">
            <p className="font-display text-xl">Precisa de orientação individual?</p>
            <p className="text-sm text-muted-foreground">
              O acolhimento inicial ajuda a identificar o próximo passo.
            </p>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/agendar">Agendar</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <a href={waLink()} target="_blank" rel="noreferrer">
              <MessageCircle /> WhatsApp
            </a>
          </Button>
        </div>
      </article>

      <BlogSection limit={3} />
      <CtaBand />
      <SiteFooter />
    </div>
  );
}
