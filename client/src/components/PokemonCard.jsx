import { useState } from 'react';
import Icon from './Icon';
import { pokemonTypes } from '../data/pokemon';

export function PokemonArt({ pokemon, className = '' }) {
  const [failed, setFailed] = useState(false);
  return pokemon.image && !failed
    ? <img src={pokemon.image} alt={pokemon.name} className={`pokemon-art object-contain ${className}`} loading="lazy" onError={() => setFailed(true)} />
    : <div role="img" aria-label={`Ilustração indisponível para ${pokemon.name}`} className={`flex items-center justify-center ${className}`}><Icon name="pokeball" className="size-20 opacity-20" /></div>;
}

export function TypeBadge({ type }) {
  const info = pokemonTypes[type] || { label: type, background: '#eceee8', color: '#596457', icon: 'sparkles' };
  return <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: info.background, color: info.color }}><Icon name={info.icon} className="size-3" />{info.label}</span>;
}

export default function PokemonCard({ pokemon, favorite, onFavorite, onOpen, layout = 'grid', index = 0 }) {
  const theme = pokemonTypes[pokemon.types[0]] || pokemonTypes.normal;
  const isList = layout === 'list';
  return (
    <article className={`card-enter group relative overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:border-[#bdcebc] hover:shadow-lg hover:shadow-forest/5 ${isList ? 'flex items-center gap-4 pr-14' : ''}`} style={{ animationDelay: `${Math.min(index, 7) * 35}ms` }}>
      <button className={`absolute z-10 icon-button ${isList ? 'top-1/2 right-3 -translate-y-1/2' : 'top-3 right-3'} ${favorite ? 'text-forest' : 'text-[#849486]'}`} onClick={() => onFavorite(pokemon.key)} aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${pokemon.name} ${favorite ? 'dos' : 'aos'} favoritos`} aria-pressed={favorite}><Icon name="heart" className="size-[18px]" fill={favorite ? 'currentColor' : 'none'} /></button>
      <button onClick={() => onOpen(pokemon)} aria-label={`Ver detalhes de ${pokemon.name}`} className={`relative overflow-hidden text-left ${isList ? 'h-28 w-32 shrink-0 rounded-l-2xl' : 'block h-[172px] w-full'}`} style={{ backgroundColor: theme.surface }}>
        {!isList && <span className="absolute top-4 left-4 font-mono text-[11px] font-medium tracking-wider text-ink/45">{pokemon.id ? `#${String(pokemon.id).padStart(3, '0')}` : 'COLEÇÃO'}</span>}
        <Icon name="pokeball" className={`absolute text-white/55 ${isList ? 'top-1 left-4 size-28' : 'top-3 right-4 size-40'}`} />
        <PokemonArt pokemon={pokemon} className={`relative mx-auto transition-transform duration-300 group-hover:scale-110 ${isList ? 'size-24' : 'mt-5 h-36 w-44'}`} />
      </button>
      <div className={isList ? 'min-w-0 flex-1 py-4' : 'px-4 pt-3.5 pb-4'}>
        <div className="flex items-center justify-between gap-2"><button onClick={() => onOpen(pokemon)} className="truncate text-left text-[17px] font-bold tracking-[-0.3px] hover:text-forest">{pokemon.name}</button>{pokemon.level != null && <span className="shrink-0 text-[10px] text-muted">Nv. {pokemon.level}</span>}{isList && pokemon.id && <span className="font-mono text-xs text-muted">#{String(pokemon.id).padStart(3, '0')}</span>}</div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">{pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}</div>
      </div>
    </article>
  );
}
