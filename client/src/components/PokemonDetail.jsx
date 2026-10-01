import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { PokemonArt, TypeBadge } from './PokemonCard';
import { pokemonTypes } from '../data/pokemon';

export default function PokemonDetail({ pokemon, onClose, favorite, onFavorite }) {
  const dialog = useRef(null);
  const theme = pokemonTypes[pokemon.types[0]] || pokemonTypes.normal;

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  return <dialog ref={dialog} onClose={(event) => { if (!event.currentTarget.open) onClose(); }} onClick={(event) => { if (event.target === dialog.current) onClose(); }} aria-labelledby="pokemon-detail-title" className="fixed inset-0 m-auto max-h-[90svh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-3xl bg-white p-0 text-ink shadow-2xl">
    <div className="relative overflow-hidden rounded-t-3xl px-7 pt-6" style={{ backgroundColor: theme.surface }}>
      <span className="font-mono text-sm text-ink/50">{pokemon.id ? `#${String(pokemon.id).padStart(3, '0')}` : 'MINHA COLEÇÃO'}</span>
      <button onClick={onClose} autoFocus aria-label="Fechar detalhes" className="icon-button absolute top-4 right-4 bg-white/70"><Icon name="close" /></button>
      <Icon name="pokeball" className="absolute top-10 left-1/2 size-60 -translate-x-1/2 text-white/60" />
      <PokemonArt pokemon={pokemon} className="relative mx-auto h-56 w-64" />
    </div>
    <div className="p-7">
      <div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="mb-1 text-[10px] font-semibold tracking-[2px] text-muted">{pokemon._id ? 'SEU COMPANHEIRO DE AVENTURAS' : 'CONHEÇA ESTE POKÉMON'}</p><h2 id="pokemon-detail-title" className="break-words text-3xl font-bold tracking-tight">{pokemon.name}</h2></div><button aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${pokemon.name} ${favorite ? 'dos' : 'aos'} favoritos`} aria-pressed={favorite} onClick={() => onFavorite(pokemon.key)} className="icon-button size-11 border border-line text-forest"><Icon name="heart" fill={favorite ? 'currentColor' : 'none'} /></button></div>
      <div className="mt-3 flex gap-2">{pokemon.types.map((type) => <TypeBadge type={type} key={type} />)}</div>
      {pokemon.description && <p className="mt-5 text-sm leading-6 text-muted">{pokemon.description}</p>}
      <dl className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-canvas p-4 text-center">{[['Altura', pokemon.height != null ? `${pokemon.height.toLocaleString('pt-BR')} m` : '—'], ['Peso', pokemon.weight != null ? `${pokemon.weight.toLocaleString('pt-BR')} kg` : '—'], [pokemon.level != null ? 'Nível' : 'Região', pokemon.level ?? (pokemon.id ? 'Kanto' : '—')]].map(([label, value]) => <div key={label}><dt className="text-[10px] text-muted">{label}</dt><dd className="mt-1 text-sm font-bold">{value}</dd></div>)}</dl>
      {!!pokemon.stats?.length && <div className="mt-6"><h3 className="mb-4 text-sm font-bold">Estatísticas base</h3><div className="space-y-3">{pokemon.stats.map((stat) => <div key={stat.name} className="flex items-center gap-3 text-xs"><span className="w-24 text-muted">{stat.name}</span><span className="w-7 font-mono font-semibold">{stat.value}</span><div role="meter" aria-label={stat.name} aria-valuenow={stat.value} aria-valuemin={0} aria-valuemax={255} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#edf0e9]"><div className="h-full rounded-full" style={{ width: `${Math.min(stat.value / 255 * 100, 100)}%`, backgroundColor: theme.color }} /></div></div>)}</div></div>}
      {pokemon._id && <Link to={`/pokemon/${pokemon._id}`} onClick={onClose} className="primary-button mt-6 w-full"><Icon name="edit" className="size-4" />Editar Pokémon</Link>}
    </div>
  </dialog>;
}
