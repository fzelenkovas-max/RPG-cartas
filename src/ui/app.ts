import { loadGameData, type Entry } from '../core/data';
import { Rng } from '../core/rng';
import { SaveError, deleteSave, exportSave, importSave, loadSave, newSave, writeSave } from '../core/save';
import { h, bar } from './dom';
import { drawPreviewCards, newPreviewRun, type AppState } from './state';
import { titleScreen } from './screens/title';
import { villageScreen, locationScreen, dungeonSelectScreen } from './screens/village';
import { dungeonScreen } from './screens/dungeon';
import { combatScreen, type CombatAction } from './screens/combat';
import { menuPanel } from './screens/menu';

const store = window.localStorage;
const LOG_MAX = 30;

export function startApp(root: HTMLElement): void {
  const data = loadGameData();
  let message = '';
  let save = null;
  try {
    save = loadSave(store);
  } catch (e) {
    message = e instanceof SaveError ? e.message : 'Erro ao ler o save.';
  }
  const state: AppState = {
    data, save, screen: save ? 'village' : 'title', locationId: null,
    menuOpen: false, tab: 'personagem', run: null, log: [], message, rng: new Rng(Date.now()),
  };

  const log = (msg: string) => {
    state.log = [msg, ...state.log].slice(0, LOG_MAX);
  };
  const go = (patch: Partial<AppState>) => {
    Object.assign(state, patch);
    render();
  };

  function importFlow() {
    pickFile((text) => {
      try {
        const s = writeSave(store, importSave(text));
        log('Save importado.');
        go({ save: s, screen: 'village', menuOpen: false, run: null, message: '' });
      } catch (e) {
        const msg = e instanceof SaveError ? e.message : 'Falha ao importar.';
        if (state.save) { log(msg); render(); } else go({ message: msg });
      }
    });
  }

  function enterDungeon(d: Entry) {
    log(`Você entra em ${d.name}.`);
    go({ screen: 'dungeon', run: newPreviewRun(data, d, state.rng) });
  }

  function resolveCard(index: 0 | 1) {
    const run = state.run!;
    const card = run.cards[index];
    log(`${index === 1 ? 'Arriscou' : 'Resolveu'}: ${card.name}.`);
    run.energy = Math.max(0, run.energy - 1);
    if (card.kind === 'combat') {
      go({ screen: 'combat', run: { ...run, enemy: state.rng.pick(data.enemies) } });
      return;
    }
    log('(efeito da carta: etapa 4)');
    go({ run: { ...run, cards: drawPreviewCards(data, state.rng) } });
  }

  function combatAction(a: CombatAction) {
    const run = state.run!;
    if (a === 'fugir' || a === 'atacar') {
      log(a === 'fugir' ? 'Você fugiu do combate.' : `Você derrotou ${run.enemy!.name}. (combate real: etapa 5)`);
      go({ screen: 'dungeon', run: { ...run, enemy: null, cards: drawPreviewCards(data, state.rng) } });
    } else {
      log(`Ação "${a}": etapa 5.`);
      render();
    }
  }

  function screenView(): HTMLElement {
    switch (state.screen) {
      case 'village':
        return villageScreen(data.locations, (id) =>
          id === 'loc_gate' ? go({ screen: 'dungeon-select' })
          : id === 'loc_chest' ? go({ menuOpen: true, tab: 'bau' })
          : id === 'loc_quest_board' ? go({ menuOpen: true, tab: 'missoes' })
          : go({ screen: 'location', locationId: id }));
      case 'location': {
        const loc = data.locations.find((l) => l.id === state.locationId)!;
        return locationScreen(loc, () => go({ screen: 'village' }));
      }
      case 'dungeon-select':
        return dungeonSelectScreen(data.dungeons, enterDungeon, () => go({ screen: 'village' }));
      case 'dungeon':
        return dungeonScreen(state.run!, {
          onResolve: () => resolveCard(0),
          onRisk: () => resolveCard(1),
          onLeave: () => { log('Você volta à vila com o que pegou.'); go({ screen: 'village', run: null }); },
        });
      case 'combat':
        return combatScreen(state.run!.enemy!, combatAction);
      default:
        return h('div');
    }
  }

  function topBar(): HTMLElement {
    const p = state.save!.player;
    return h('header', { class: 'topbar' },
      h('div', { class: 'topbar-row' },
        h('span', { class: 'who' }, `${p.name} · Nv ${p.characterLevel}`),
        h('span', { class: 'gold' }, `💰 ${p.gold}`),
        h('button', { class: 'icon-btn', onClick: () => go({ menuOpen: true }), aria: 'Abrir menu' }, '☰'),
      ),
      h('div', { class: 'bars' }, bar('HP', p.hp, p.hp, 'hp'), bar('MP', p.mp, p.mp, 'mp')),
    );
  }

  function sidePanel(): HTMLElement {
    const s = state.save!;
    const p = s.player;
    return h('aside', { class: 'side' },
      h('section', { class: 'panel' },
        h('h3', {}, 'Personagem'),
        h('p', {}, `${p.name} · Novato`),
        h('p', { class: 'muted' }, `Nível ${p.characterLevel} · Classe ${p.classLevel}`),
        bar('HP', p.hp, p.hp, 'hp'), bar('MP', p.mp, p.mp, 'mp'),
        h('p', { class: 'muted' }, `Ouro ${p.gold} · Profundidade ${s.depthRecord}`),
      ),
      h('section', { class: 'panel log' },
        h('h3', {}, 'Registro'),
        state.log.length ? h('ul', {}, ...state.log.map((l) => h('li', {}, l))) : h('p', { class: 'muted' }, 'Nada ainda.'),
      ),
    );
  }

  function render(): void {
    root.replaceChildren();
    if (!state.save || state.screen === 'title') {
      root.append(h('div', { class: 'layout single' }, h('main', { class: 'main' },
        titleScreen({
          message: state.message,
          onNew: () => { const s = writeSave(store, newSave()); log('Novo jogo iniciado.'); go({ save: s, screen: 'village', message: '' }); },
          onImport: importFlow,
        }))));
      return;
    }
    const lastLog = state.log[0];
    const main = h('main', { class: 'main' },
      topBar(),
      h('div', { class: 'content' }, screenView()),
      lastLog ? h('div', { class: 'toast-log' }, lastLog) : null,
    );
    const layout = h('div', { class: 'layout' }, main, sidePanel());
    root.append(layout);
    if (state.menuOpen) {
      root.append(menuPanel(state.tab, state.save, data, {
        onTab: (t) => go({ tab: t }),
        onClose: () => go({ menuOpen: false }),
        onExport: () => download(exportSave(state.save!)),
        onImport: importFlow,
        onDelete: () => {
          if (confirm('Apagar o save? Isso não pode ser desfeito.')) {
            deleteSave(store);
            state.log = [];
            go({ save: null, screen: 'title', menuOpen: false, run: null, message: 'Save apagado.' });
          }
        },
      }));
    }
  }

  render();
}

function download(text: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = 'rpg-cartas-save.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function pickFile(onText: (t: string) => void): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.addEventListener('change', async () => {
    const f = input.files?.[0];
    if (f) onText(await f.text());
  });
  input.click();
}
