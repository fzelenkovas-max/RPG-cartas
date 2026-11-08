# Projeto: RPG de masmorra em cartas, single player (inspiração Underquest / Iron Helm)

## Documento de referência
- `GDD_rpg_cartas.md` é a fonte da verdade do design. Ler antes de cada etapa.
- Seguir as decisões do GDD. Não inventar sistemas novos nem abstrair demais sem consultar o usuário.
- Pendências na seção 0 do GDD: perguntar ao usuário quando a etapa depender delas.
- Fórmulas de dano: versão multiplicativa da skill (decidida). HP/MP iniciais: 20/10 (decidido).
- Mecânicas inspiradas nos jogos de referência são permitidas; nomes, textos e artes devem ser originais.

## Stack
- TypeScript + Vite. Interface em HTML/CSS + SVG, sem motor de jogo.
- Build final em um único HTML (vite-plugin-singlefile) + PWA (instalável no celular, funciona offline).
- Conteúdo em dados (JSON em `src/data/`): cartas, inimigos, modificadores, itens, encontros, missões, habilidades. IDs fixos, nunca reaproveitar.
- Lógica do jogo separada da interface (`src/core/` sem acesso ao DOM), com sorteios por semente para testes.
- Testes automáticos (Vitest) para fórmulas, sorteios, save e migrações.
- Save versionado (`saveVersion` + migrações) em localStorage, com exportar/importar. Updates não podem quebrar personagens existentes.
- Interface pensada primeiro para celular na vertical; no PC, tela centralizada com painel lateral.

## Publicação e testes
- Repositório no GitHub. Publicar no GitHub Pages via GitHub Actions a cada push na branch principal.
- O usuário testa pelo link do GitHub Pages no celular. Ao terminar cada etapa, informar o link e o que testar.
- Rodar os testes e conferir o build antes de dar uma etapa por concluída.

## Arte
- Tudo em SVG feito no código: molduras por tipo/raridade, ícones, ilustrações de inimigos.
- Modificadores de inimigo aparecem visualmente (cor, aura, detalhes sobrepostos).
- Estilo medieval sombrio, consistente em todas as cartas.

## Forma de trabalhar
- Trabalhar por etapas (lista abaixo). Ao terminar, resumir o que foi feito, o que testar e o que falta.
- Respostas, textos do jogo e comentários em português.
- Commits pequenos e descritivos.

## Etapas
1. Estrutura do projeto, save versionado, carregamento dos dados, GitHub Pages
2. Interface base (vertical/PC): vila, masmorra, combate, menus em abas
3. Personagem: dois níveis, atributos, skills, fórmulas
4. Motor da masmorra: baralho, duas portas, pistas, fases, energia
5. Combate por turnos, elementos, modificadores de inimigo
6. Itens, 9 slots, mochila, baú, raridade, tiers
7. Vila: NPCs, lojas, alquimia, quadro de missões, bestiário
8. Arte em SVG: molduras, ícones, inimigos, visual dos modificadores
9. Conteúdo do tutorial (cartas, inimigos e itens em JSON)
10. Chefe do tutorial, quest de classe, 3 árvores de habilidades
11. Profundidade infinita + balanceamento
12. Testes, correções, PWA instalável
