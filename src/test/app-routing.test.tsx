import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    "/servicos",
    "/convenios",
    "/equipe",
    "/ambiente",
    "/autismo",
    "/blog",
    "/agendar",
    "/minhas-consultas",
    "/acesso",
  ])("matches the public page %s", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.pathname.replace(/\/$/, "")).toBe(path);
  });

  it("matches a blog post detail route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes("/blog/o-que-e-aba-e-como-funciona-para-criancas-com-tea");
    expect(matches.at(-1)?.params).toMatchObject({
      slug: "o-que-e-aba-e-como-funciona-para-criancas-com-tea",
    });
  });

  it.each([
    "/painel",
    "/painel/cadastros",
    "/painel/contratos",
    "/painel/repasses",
    "/painel/contabilidade",
    "/painel/usuarios",
  ])("matches the management page %s", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.pathname.replace(/\/$/, "")).toBe(path);
    expect(matches.some((match) => match.routeId === "/painel")).toBe(true);
  });
});
