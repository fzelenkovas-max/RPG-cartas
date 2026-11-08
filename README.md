# RPG de Cartas

RPG de masmorra em cartas, single player. Design em `GDD_rpg_cartas.md`; regras de trabalho em `CLAUDE.md`.

## Comandos
- `npm install` — instala dependências
- `npm run dev` — servidor de desenvolvimento
- `npm test` — testes (Vitest)
- `npm run build` — checagem de tipos + build em um único HTML (`dist/index.html`)

## Publicação
Push na `main` dispara `.github/workflows/pages.yml` (testes, build e deploy no GitHub Pages).
Requer Settings → Pages → Source: **GitHub Actions**.
