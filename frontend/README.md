# ConCrunch – frontend (kostra)

Vite + React + TypeScript + Tailwind CSS 4.

```bash
npm install
cp .env.example .env
npm run dev
```

## Struktura

```
src/
  app/router.tsx          všechny routy (veřejná část + /admin)
  api/client.ts           tenký fetch wrapper, sem přijdou endpointy
  types/                  typy Program / Performer / Venue / News
  lib/placeholders.ts     zástupná data – po napojení API smazat
  components/layout/      AppShell, Header, BottomNav
  components/ui/          PillTabs, Card, Avatar, PageTitle
  features/program/       časová osa programu po dnech
  features/catalog/       Účinkující / Místa
  features/news/          novinky
  features/admin/         přihlášení + správa (kostra)
```

Mapa (/mapa) není součástí kostry.
