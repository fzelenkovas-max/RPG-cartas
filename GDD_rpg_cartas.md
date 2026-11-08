# GDD compacto — RPG de masmorra em cartas, single player (inspiração Underquest / Iron Helm)
> Versão alternativa ao GDD_rpg_topdown.md. Reaproveita classes, níveis, fórmulas, loot e bestiário; troca mapa/sprites por cartas.

## 0. Pendências para você decidir
- [ ] **Raças?** (ex.: Humano, Anão, Elfo, Meio-orc) dando bônus de atributos. Sugestão: sim, 4 raças.
- [ ] **Familiar/companheiro?** Pequeno bônus passivo (ex.: corvo = +1 em testes de Mente). Sugestão: sim, desbloqueável.
- [ ] **Atributos de teste**: criar Força / Agilidade / Mente para encontros, ou usar as skills? Sugestão: criar os 3, derivados de classe + nível + equipamento.
- [ ] **Dados visíveis** (rolagem animada de d6/d12/d20, clima de tabuleiro) ou só números? Sugestão: dados visíveis.
- [ ] **Morte na masmorra**: perde o loot da partida, mantém XP e o que já guardou no baú? (sugestão)
- [ ] **Energia**: limita o número de turnos por masmorra (rações recuperam)? Sugestão: sim, cria tensão.
- [ ] Nome do jogo e da vila inicial.

## 1. Conceito
- Medieval sombrio, mundo assolado por forças malignas (chefes). Single player.
- Cada expedição = uma **partida** de 15–30 min em uma masmorra feita de cartas.
- Entre partidas: **vila** (base) com lojas, baú, mestre de classes.
- **Progressão infinita**: nível de personagem sem limite + profundidade de masmorra sem limite.
- Personagem masculino ou feminino. Celular (vertical) + PC.

## 2. Tecnologia e arte
- **TypeScript + Vite**, interface em HTML/CSS + SVG (sem motor de jogo). Saída em **um único HTML** (vite-plugin-singlefile), e depois PWA para instalar no celular.
- Conteúdo 100% em JSON: cartas, inimigos, modificadores, itens, encontros, missões.
- Save versionado (`saveVersion` + migrações), exportar/importar.
- **Arte**: cartas em SVG (moldura por tipo/raridade, ícones, ilustração simples). Inimigos ilustrados em SVG, com modificadores visuais por cima (cor, aura, chifres, olhos). Os tilesets OTSP não são necessários.

## 3. Estrutura de uma partida
1. Na vila: escolher masmorra (profundidade), comprar suprimentos, equipar.
2. A masmorra tem **3 fases + chefe**. Cada fase exige juntar um número de **pistas** (tokens de missão).
3. **Turno — "Duas portas"**:
   - Compra 2 cartas viradas. Revela a primeira.
   - **Resolver** a primeira (seguro) ou **arriscar** a segunda às cegas.
   - A segunda carta tem efeito **amplificado ×1,5** (tesouro melhor, inimigo mais forte, armadilha pior).
   - Cada carta resolvida pode dar pistas de um tipo (Espada, Olho, Chave, Caveira). A fase pede uma combinação (ex.: 2 Chaves + 1 Olho).
4. Gasta 1 de **Energia** por turno; sem energia, perde HP por turno até comer.
5. Completou as fases → **chefe**. Venceu → recompensas + libera a profundidade seguinte. Pode **sair antes** com o que já pegou (escolha de risco).

### Tipos de carta de masmorra
- **Combate**: inimigo (pode ter modificadores).
- **Tesouro**: ouro (só se houver humanoide), item, ingrediente.
- **Encontro**: evento com teste de Força/Agilidade/Mente; recompensa ou penalidade.
- **Armadilha**: teste para evitar dano, veneno ou perda de energia.
- **Acampamento**: recupera HP/MP/energia (gasta ração).
- **Mercador errante**: compra/venda dentro da masmorra.
- **Santuário**: bênção temporária (até o fim da partida).
- **Evento de missão**: avança missão da vila ou cadeia de história.

## 4. Tutorial — Vila inicial (Novato, nível de classe 1–10)
- Vila pequena com NPCs: ancião/guia, ferreiro, armeiro, alquimista, comerciante, baú, mestre de classes, quadro de missões.
- 3 masmorras curtas de tutorial, cada uma ensinando algo:
  1. Porão dos ratos — duas portas, combate, loot.
  2. Floresta sombria — encontros e testes, armadilhas, acampamento.
  3. Cripta antiga — modificadores de inimigo, pistas, **chefe do tutorial** (ex.: necromante menor).
- Fim: Novato nível de classe 10 → quest de classe → Guerreiro/Mago/Arqueiro → libera o mundo principal.

## 5. Progressão (reaproveitada do GDD top-down)
- **Duas barras**: nível de personagem (infinito) e nível de classe (Novato 10 | Classe 1: 30 | Classe 2: 50 | Classe 3: 70 | Classe 4: 100).
- +1 de dano a cada 5 níveis de personagem.
- 1 ponto de habilidade por nível de classe (Novato não ganha). Árvores anteriores ficam disponíveis. Troca de classe: nível de classe máximo + quest.
- **HP/MP iniciais: 20 / 10.** Por nível: Novato +3/+1 | Guerreiro +6/+2 | Mago +2/+6 | Arqueiro +4/+4.
- **Skills por uso**: Magia, Espada, Machado, Escudo, Arco, Besta (sobem a cada ataque/bloqueio em combate).
- XP: curva lenta (`XP = 50 × nível^2.2`).

### Progressão infinita — profundidade
- Cada masmorra vencida libera a próxima profundidade (1, 2, 3…, sem limite).
- Nível dos inimigos = base da profundidade. **A cada 5 profundidades**: +1 modificador possível por inimigo e novo **tier** de equipamento no loot.
- **A cada 10 profundidades**: novo chefe (rotação de chefes com modificadores, ex.: "Necromante Flamejante dos Ermos").
- Recorde de profundidade salvo; atalhos para recomeçar em marcos (10, 20, 30…).

## 6. Classes
| Arquétipo | Classe 1 | Classe 2 | Classe 3 | Classe 4 |
|---|---|---|---|---|
| Corpo a corpo | Guerreiro | Cavaleiro | Campeão | Senhor da Guerra |
| Magia | Mago | Feiticeiro | Arquimago | Arcanista Supremo |
| Distância | Arqueiro | Caçador | Patrulheiro | Olho de Falcão |
- Distância importa no combate: Mago/Arqueiro atacam primeiro no 1º turno (vantagem de alcance); Guerreiro aguenta mais.
- Árvores com 3 ramos cada (mesmas diretrizes do GDD top-down). Algumas habilidades mexem com as cartas (ex.: Arqueiro "Batedor" espia a 2ª carta; Mago "Vidência" troca uma carta; Guerreiro "Arrombar" ganha pista extra em combate).

## 7. Combate (por turnos)
- Ações: Atacar, Habilidade (MP + recarga), Defender, Poção, Fugir (teste de Agilidade, perde a carta).
- **Dano físico** = (ataque da arma + nível÷5) × (1 + skill da arma ÷ 50), ±15%.
- **Dano mágico** = (dano da magia + nível÷5) × (1 + skill Magia ÷ 50), ±15%.
- **Defesa física**: % sobre % (`r = def ÷ (def + K)`); escudo bloqueia com skill Escudo.
- **Defesa mágica**: resistências elementais % sobre %, teto 80%.
- Elementos: Físico, Fogo, Gelo, Raio, Terra/Veneno, Sagrado, Sombrio. Fraquezas e resistências.
- Armas: Espada equilibrada; Machado mais ataque, menos defesa; 1 ou 2 mãos (2 mãos impede escudo). Arco: menos dano, flechas baratas; Besta: mais dano, dardos caros. Munição gasta por ataque.

### Inimigos e modificadores
- Inimigos base por família (animais, insetos, mortos-vivos, goblinoides, demônios, elementais).
- **Prefixos/sufixos** (ex.: "Lobo **Faminto** **da Geada**"): +HP, +dano, elemento, imunidade, veneno, regeneração, enxame. Cada modificador = mais XP e chance de loot.
- 20 inimigos × 15 prefixos × 15 sufixos ≈ milhares de combinações, crescendo a cada atualização.

## 8. Itens, loot e inventário
- 9 slots: arma, escudo, elmo, armadura, calça, bota, 2 anéis, amuleto.
- Raridade: Comum, Incomum, Raro, Épico, Lendário. Tier por profundidade.
- **Mochila limitada na partida** (ex.: 12 espaços); **baú na vila ilimitado**.
- Loot por inimigo com chance própria (inclusive nada). Mais forte = mais raro. **Só humanoides dropam ouro**; os outros dropam itens de venda e ingredientes.
- **Ingredientes → alquimista**: poções de cura, mana, antídoto, rações, bênçãos.
- Chefes: loot mais forte, chances baixas.

## 9. Bestiário e coleção
- Bestiário por inimigo base e por chefe: estágios por abates (10/100/500/2000) → revela fraquezas/loot e dá +% dano e +% defesa contra ele.
- Bônus extra por **modificadores catalogados** (enfrentar cada prefixo/sufixo).
- Álbum de cartas descobertas (encontros, tesouros, lugares).

## 10. Missões
- Quadro de missões na vila: simples (matar X, trazer Y, chegar à profundidade Z).
- Cadeias de história com cartas de evento de missão que aparecem nas masmorras.
- Quests de classe obrigatórias para cada troca.
- Recompensas: XP, ouro, itens, companheiros, títulos, bônus permanentes.

## 11. Interface (celular vertical + PC)
- Masmorra: duas cartas no centro, barra de HP/MP/Energia em cima, pistas da fase, botões grandes embaixo.
- Combate: inimigo em cima, dados/ações embaixo.
- Vila: lista de locais (cartões tocáveis).
- Menu em abas: Personagem, Equipamento, Habilidades, Skills, Missões, Bestiário, Baú, Opções.
- No PC: mesma tela centralizada, com painel lateral de personagem/registro.

## 12. Sustentabilidade / updates
- Atualizar = adicionar JSON: inimigos, modificadores, cartas, encontros, itens, missões, chefes.
- IDs fixos; save versionado com migrações.
- Ferramenta de debug (dar item, mudar nível/profundidade, forçar carta).

## 13. Sugestões extras
- Desafios diários (masmorra com regra especial, mesma semente).
- Melhorias da vila com ouro (loja melhor, baú maior, alquimia nova).
- Morte com "legado": parte da XP vira bônus permanente pequeno.
- Moralidade/reputação via escolhas nos encontros.
