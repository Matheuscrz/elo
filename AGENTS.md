<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Keep internal management pages as child routes of `painel.tsx`, which renders an Outlet, so the staff navigation is shared.
- Until persistence is requested, new interface prototypes use in-session React state and visibly identify demonstration data; never imply production records or access controls exist.
- Share management table, form and CSV helpers outside route modules so automatic route splitting cannot affect reused UI or utilities.
