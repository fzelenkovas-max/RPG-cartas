import './ui/style.css';
import { loadGameData } from './core/data';
import {
  CURRENT_SAVE_VERSION,
  SaveError,
  deleteSave,
  exportSave,
  importSave,
  loadSave,
  newSave,
  writeSave,
  type SaveData,
} from './core/save';

const app = document.getElementById('app')!;
const store = window.localStorage;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', cls = ''): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (text) n.textContent = text;
  if (cls) n.className = cls;
  return n;
}

function button(label: string, onClick: () => void): HTMLButtonElement {
  const b = el('button', label);
  b.addEventListener('click', onClick);
  return b;
}

function render(save: SaveData | null, message = ''): void {
  app.replaceChildren();
  const root = el('main', '', 'screen');
  root.append(el('h1', 'RPG de Cartas'), el('p', 'Etapa 1 · estrutura, save e dados', 'sub'));

  const data = loadGameData();
  const dataBox = el('section');
  dataBox.append(el('h2', 'Dados carregados'));
  const ul = el('ul');
  for (const [kind, list] of Object.entries(data)) ul.append(el('li', `${kind}: ${list.length}`));
  dataBox.append(ul);

  const saveBox = el('section');
  saveBox.append(el('h2', 'Save'));
  if (save) {
    saveBox.append(
      el('p', `Versão ${save.saveVersion} (atual ${CURRENT_SAVE_VERSION})`),
      el('p', `${save.player.name} · nível ${save.player.characterLevel} · HP ${save.player.hp} · MP ${save.player.mp} · ouro ${save.player.gold}`),
      el('p', `Atualizado: ${new Date(save.updatedAt).toLocaleString('pt-BR')}`),
    );
    const actions = el('div', '', 'row');
    actions.append(
      button('+1 ouro (teste)', () => render(writeSave(store, { ...save, player: { ...save.player, gold: save.player.gold + 1 } }))),
      button('Exportar', () => download(exportSave(save))),
      button('Importar', () => pickFile((t) => tryImport(t))),
      button('Apagar', () => {
        if (confirm('Apagar o save?')) {
          deleteSave(store);
          render(null, 'Save apagado.');
        }
      }),
    );
    saveBox.append(actions);
  } else {
    saveBox.append(el('p', 'Nenhum save encontrado.'));
    const actions = el('div', '', 'row');
    actions.append(
      button('Novo jogo', () => render(writeSave(store, newSave()))),
      button('Importar', () => pickFile((t) => tryImport(t))),
    );
    saveBox.append(actions);
  }
  if (message) saveBox.append(el('p', message, 'msg'));
  root.append(saveBox, dataBox);
  app.append(root);
}

function tryImport(text: string): void {
  try {
    render(writeSave(store, importSave(text)), 'Save importado.');
  } catch (e) {
    render(safeLoad(), e instanceof SaveError ? e.message : 'Falha ao importar.');
  }
}

function download(text: string): void {
  const a = el('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = 'rpg-cartas-save.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function pickFile(onText: (t: string) => void): void {
  const input = el('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.addEventListener('change', async () => {
    const f = input.files?.[0];
    if (f) onText(await f.text());
  });
  input.click();
}

function safeLoad(): SaveData | null {
  try {
    return loadSave(store);
  } catch {
    return null;
  }
}

try {
  render(loadSave(store));
} catch (e) {
  render(null, e instanceof SaveError ? e.message : 'Erro ao ler o save.');
}
