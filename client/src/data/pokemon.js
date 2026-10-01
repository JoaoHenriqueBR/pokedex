import pokemonCatalog from './catalog.json';

export const catalog = pokemonCatalog;

export const pokemonTypes = {
  grass: { label: 'Planta', color: '#477b38', background: '#e1edce', surface: '#edf3e3', icon: 'leaf' },
  fire: { label: 'Fogo', color: '#b65b38', background: '#f9e0d2', surface: '#fbede3', icon: 'flame' },
  water: { label: 'Água', color: '#477dac', background: '#dceaf7', surface: '#e9f2f9', icon: 'drop' },
  electric: { label: 'Elétrico', color: '#9c7c22', background: '#f6edbb', surface: '#faf6de', icon: 'bolt' },
  bug: { label: 'Inseto', color: '#6b7f30', background: '#e6edc7', surface: '#f0f3e2', icon: 'bug' },
  normal: { label: 'Normal', color: '#797660', background: '#eae7dc', surface: '#f3f1e9', icon: 'pokeball' },
  poison: { label: 'Veneno', color: '#8c5999', background: '#eedff2', surface: '#f5ecf7', icon: 'drop' },
  ground: { label: 'Terrestre', color: '#99763d', background: '#f0e2c6', surface: '#f8f0e3', icon: 'globe' },
  flying: { label: 'Voador', color: '#7773a5', background: '#e7e5f4', surface: '#f1f0fa', icon: 'leaf' },
  psychic: { label: 'Psíquico', color: '#b25880', background: '#f5ddea', surface: '#faedf4', icon: 'sparkles' },
  rock: { label: 'Pedra', color: '#897c42', background: '#ece6cb', surface: '#f4f0e3', icon: 'globe' },
  ghost: { label: 'Fantasma', color: '#736091', background: '#e6def0', surface: '#f0ebf6', icon: 'sparkles' },
  ice: { label: 'Gelo', color: '#488c9a', background: '#d9eff2', surface: '#eaf7f9', icon: 'sparkles' },
  dragon: { label: 'Dragão', color: '#6855a0', background: '#e4ddf4', surface: '#eeebf8', icon: 'flame' },
  dark: { label: 'Sombrio', color: '#6e625e', background: '#e4deda', surface: '#efece9', icon: 'compass' },
  steel: { label: 'Aço', color: '#687e87', background: '#dfe7e9', surface: '#edf2f3', icon: 'collection' },
  fairy: { label: 'Fada', color: '#ac6992', background: '#f2dfeb', surface: '#f9eef5', icon: 'sparkles' },
  fighting: { label: 'Lutador', color: '#a45e4d', background: '#efdcd4', surface: '#f8ede8', icon: 'bolt' },
};

const normalizeText = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
const typeAliases = Object.fromEntries(Object.entries(pokemonTypes).flatMap(([key, type]) => [[key, key], [normalizeText(type.label), key]]));
Object.assign(typeAliases, { grama: 'grass', vegetal: 'grass', terra: 'ground', venenoso: 'poison', luta: 'fighting', insetos: 'bug', eletricidade: 'electric' });

export function normalizePokemon(record) {
  const known = catalog.find((pokemon) => normalizeText(pokemon.name) === normalizeText(record.name));
  const name = String(record.name || 'Pokémon');
  const rawTypes = record.type ? String(record.type).split(/[,/]/) : record.types || known?.types || ['normal'];
  const types = [...new Set(rawTypes.map((type) => typeAliases[normalizeText(type)] || normalizeText(type)).filter(Boolean))];
  return {
    ...known,
    ...record,
    id: known?.id ?? (record._id ? null : record.id ?? null),
    key: String(record._id || known?.id || record.id || name),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    types: types.length ? types : ['normal'],
    image: known?.image ?? null,
  };
}
