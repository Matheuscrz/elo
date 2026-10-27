import type { ReactNode } from "react";

export function PageTitle({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
