import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, MapPin, Menu, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CLINIC, waLink } from "@/lib/clinic";

const NAV = [
  { to: "/servicos" as const, label: "Serviços" },
  { to: "/convenios" as const, label: "Convênios" },
  { to: "/equipe" as const, label: "Equipe" },
  { to: "/ambiente" as const, label: "Ambiente" },
  { to: "/autismo" as const, label: "Autismo" },
  { to: "/blog" as const, label: "Blog" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label={`${CLINIC.name} — página inicial`}>
      <img
        src={light ? "/media/logo-white.png" : "/media/logo.png"}
        alt={CLINIC.name}
        width={light ? 304 : 501}
        height={light ? 110 : 501}
        className={light ? "h-8 w-auto" : "h-11 w-11"}
      />
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="hidden border-b border-border/50 bg-secondary/60 lg:block">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-5">
            <a
              href={CLINIC.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <MapPin className="h-3.5 w-3.5" /> {CLINIC.address}
            </a>
            <a
              href={`tel:+55${CLINIC.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <Phone className="h-3.5 w-3.5" /> {CLINIC.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/minhas-consultas" className="font-medium hover:text-foreground">
              Área do paciente
            </Link>
            <Link to="/acesso" className="hover:text-foreground">
              Acesso da equipe
            </Link>
            <a
              href={CLINIC.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-foreground"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />

        <nav
          className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
          aria-label="Navegação principal"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-foreground"
              activeProps={{ className: "font-semibold text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="hidden rounded-full sm:inline-flex"
          >
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">
              <MessageCircle />
            </a>
          </Button>
          <Button asChild className="hidden rounded-full sm:inline-flex">
            <Link to="/agendar">Agendar</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-4 grid gap-1 px-4" aria-label="Navegação mobile">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm hover:bg-muted"
            >
              Home
            </Link>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/minhas-consultas"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm hover:bg-muted"
            >
              Área do paciente
            </Link>
            <Link
              to="/acesso"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm hover:bg-muted"
            >
              Acesso da equipe
            </Link>
          </nav>
          <div className="mt-4 grid gap-2 px-4">
            <Button asChild className="rounded-full">
              <Link to="/agendar" onClick={() => setOpen(false)}>
                Agendar atendimento
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <a href={waLink()} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              {CLINIC.address}
              <br />
              {CLINIC.phone}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
