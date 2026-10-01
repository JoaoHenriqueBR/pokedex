import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { listPokemon } from '../../services/pokemonService';
import { catalog, normalizePokemon, pokemonTypes } from '../data/pokemon';
import Icon from '../components/Icon';
import PokemonCard from '../components/PokemonCard';
import PokemonDetail from '../components/PokemonDetail';

const PAGE_SIZE = 12;
const normalizeText = (text) => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const initialPokemon = catalog.map(normalizePokemon);
const headings = {
  pokedex: ['Explore a Pokédex', 'Cada Pokémon, uma nova história para descobrir.'],
  favorites: ['Seus favoritos', 'Os Pokémon que conquistaram um lugar na sua aventura.'],
  collection: ['Minha coleção', 'Seus companheiros, suas histórias, sua jornada.'],
};

export default function PokemonList({ view = 'pokedex' }) {
  const { favorites, toggleFavorite } = useOutletContext();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [order, setOrder] = useState('number');
  const [layout, setLayout] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [successDismissed, setSuccessDismissed] = useState(false);
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['pokemon'], queryFn: listPokemon, enabled: view !== 'pokedex', retry: false, staleTime: 30_000,
  });
  const collection = Array.isArray(data) ? data.map(normalizePokemon) : [];
  const source = view === 'collection' ? collection : view === 'favorites' ? [...initialPokemon, ...collection].filter((pokemon) => favorites.includes(pokemon.key)) : initialPokemon;
  const needle = normalizeText(search).replace(/^#/, '');
  const matches = source.filter((pokemon) => (type === 'all' || pokemon.types.includes(type)) && (!needle || normalizeText(pokemon.name).includes(needle) || (pokemon.id != null && (/^\d+$/.test(needle) ? pokemon.id === Number(needle) : false))));
  matches.sort((a, b) => order === 'name' ? a.name.localeCompare(b.name, 'pt-BR') : order === 'name-desc' ? b.name.localeCompare(a.name, 'pt-BR') : order === 'number-desc' ? (b.id || 0) - (a.id || 0) : (a.id || Infinity) - (b.id || Infinity));
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = matches.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const loading = view === 'collection' && isPending;
  const uniqueTypes = new Set(source.flatMap((pokemon) => pokemon.types)).size;
  const [title, subtitle] = headings[view];

  function chooseType(nextType) { setType(nextType); setPage(1); }
  function clearFilters() { setSearch(''); setType('all'); setPage(1); }
  function changePage(nextPage) { setPage(nextPage); document.getElementById('pokemon-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  return <>
    {location.state?.success && !successDismissed && <div role="status" className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900"><Icon name="check" className="size-4" /><span className="flex-1">{location.state.success}</span><button aria-label="Dispensar mensagem" onClick={() => setSuccessDismissed(true)} className="icon-button"><Icon name="close" className="size-4" /></button></div>}
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-[28px] font-bold tracking-[-1.2px] sm:text-[32px]">{title}<span className="text-[#83a878]">.</span></h1><p className="mt-1 text-xs leading-5 text-muted sm:text-sm">{subtitle}</p></div>
      <Link to="/pokemon" className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold transition-colors hover:border-forest hover:text-forest"><Icon name="plus" className="size-4" />Novo Pokémon</Link>
    </div>

    {view === 'pokedex' && <section aria-label="Bem-vindo à Pokédex" className="relative mb-7 overflow-hidden rounded-[22px] bg-[#245b45] px-6 py-7 sm:px-8 sm:py-8">
      <div className="hero-pattern absolute inset-y-0 right-0 w-1/2 opacity-15" />
      <div className="relative z-10 max-w-[66%] sm:max-w-[65%]"><span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[9px] font-semibold tracking-[1.3px] text-[#d8eac4]"><Icon name="sparkles" className="size-3" />A AVENTURA ESTÁ AQUI</span><h2 className="mt-4 text-[25px] leading-[1.18] font-bold tracking-[-0.8px] text-white sm:text-[34px]">Um universo inteiro.<br /><span className="text-[#c8dfa9]">Infinitas descobertas.</span></h2><p className="mt-3 max-w-80 text-[11px] leading-5 text-[#d2e1d3] sm:text-xs">Conheça os tipos, encontre seus favoritos<br className="hidden sm:block" /> e dê o primeiro passo na sua jornada.</p><span className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold text-[#dbe7d1]"><span className="flex size-5 items-center justify-center rounded-full bg-white/10"><Icon name="globe" className="size-3" /></span>Uma seleção especial da região de Kanto <Icon name="arrow-right" className="size-3" /></span></div>
      <div aria-hidden="true" className="absolute inset-y-0 right-[-42px] flex w-[48%] items-center justify-center sm:right-0 sm:w-[43%]"><div className="absolute size-52 rounded-full border border-[#b2d295]/15 sm:size-72" /><div className="absolute size-40 rounded-full bg-[#c1d999]/10 sm:size-56" /><Icon name="pokeball" className="absolute size-36 -rotate-20 text-[#bfd49d]/10 sm:size-52" /><img src="/pokemon/1.png" alt="" className="pokemon-art relative mt-7 w-[190px] -rotate-8 object-contain sm:mt-5 sm:w-[245px]" fetchPriority="high" /><span className="absolute right-[18%] bottom-6 hidden -rotate-6 rounded-full border border-white/20 bg-[#477957] px-3 py-1.5 text-[9px] font-semibold text-[#eff6d8] sm:inline-flex">#001 · Bulbasaur <span className="ml-1">✦</span></span><span className="absolute top-7 right-[20%] text-xl text-[#c8dfa9]">✧</span></div>
    </section>}

    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-4 text-[11px] sm:gap-6"><span className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[#eaf0e4] text-forest"><Icon name="pokeball" className="size-4" /></span><strong>{loading ? '—' : source.length}</strong><span className="text-muted">Pokémon {view === 'collection' ? 'na coleção' : view === 'favorites' ? 'favoritos' : 'para descobrir'}</span></span><span className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[#f1eddf] text-[#a18b56]"><Icon name="bolt" className="size-4" /></span><strong>{uniqueTypes}</strong><span className="text-muted">tipos diferentes</span></span></div>
      <button onClick={() => setSelected(matches[Math.floor(Math.random() * matches.length)])} disabled={!matches.length} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-forest disabled:opacity-40"><Icon name="shuffle" className="size-3.5" />Surpreenda-me</button>
    </div>

    <div className="flex gap-2 rounded-2xl border border-line bg-white p-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 pl-3 sm:gap-3"><Icon name="search" className="size-[18px] shrink-0 text-muted" /><input type="search" aria-label="Buscar Pokémon por nome ou número" className="min-w-0 flex-1 bg-transparent py-2.5 text-xs outline-none placeholder:text-[#949b93] sm:text-sm" placeholder="Qual Pokémon você está procurando?" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />{search && <button aria-label="Limpar busca" onClick={() => { setSearch(''); setPage(1); }} className="icon-button size-7"><Icon name="close" className="size-4" /></button>}<span className="mr-3 hidden rounded border border-line px-1.5 py-1 font-mono text-[9px] text-[#929c91] xl:inline">nome ou #número</span></div>
      <button aria-label="Filtros" aria-expanded={filtersOpen} aria-controls="type-filters" onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors sm:px-4 ${filtersOpen || type !== 'all' ? 'border-forest/20 bg-[#eaf1e7] text-forest' : 'border-line bg-canvas text-ink hover:bg-[#eaf1e7]'}`}><Icon name="filter" className="size-4" /><span className="hidden sm:inline">Filtros</span></button>
    </div>
    {filtersOpen && <div id="type-filters" className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-4"><label htmlFor="all-types" className="text-xs font-semibold">Filtrar por tipo</label><select id="all-types" className="field max-w-52" value={type} onChange={(event) => chooseType(event.target.value)}><option value="all">Todos os tipos</option>{Object.entries(pokemonTypes).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select>{type !== 'all' && <button onClick={() => chooseType('all')} className="text-xs font-semibold text-forest underline underline-offset-4">Limpar filtro</button>}</div>}
    <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Filtros rápidos por tipo">
      {['all', 'grass', 'fire', 'water', 'electric', 'bug', 'normal'].map((key) => { const info = pokemonTypes[key]; const active = type === key; return <button key={key} onClick={() => chooseType(key)} aria-pressed={active} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition-colors ${active ? 'border-forest bg-forest text-white' : 'border-line bg-white text-muted hover:border-[#b4c6ae] hover:text-forest'}`}><Icon name={info?.icon || 'grid'} className="size-3" />{info?.label || 'Todos'}{key === 'all' && <span className={`ml-0.5 rounded px-1 text-[9px] ${active ? 'bg-white/15' : 'bg-canvas'}`}>{source.length}</span>}</button>; })}
    </div>

    <section id="pokemon-results" aria-label="Resultados da Pokédex" className="mt-7 scroll-mt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-xs text-muted">{loading ? 'Carregando seus Pokémon…' : <><strong className="font-semibold text-ink">{matches.length} Pokémon</strong> {search || type !== 'all' ? 'encontrados' : view === 'favorites' ? 'favoritos' : 'esperando por você'}</>}</p><div className="flex items-center gap-3"><label htmlFor="sort" className="hidden text-[10px] text-muted sm:inline">Ordenar por:</label><select id="sort" aria-label="Ordenar Pokémon" className="max-w-44 bg-transparent py-1 text-[11px] font-semibold text-ink" value={order} onChange={(event) => { setOrder(event.target.value); setPage(1); }}><option value="number">Número crescente</option><option value="number-desc">Número decrescente</option><option value="name">Nome: A–Z</option><option value="name-desc">Nome: Z–A</option></select><div className="flex rounded-lg border border-line bg-white p-0.5"><button aria-label="Visualizar em grade" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')} className={`rounded-md p-1.5 ${layout === 'grid' ? 'bg-[#eaf1e7] text-forest' : 'text-muted'}`}><Icon name="grid" className="size-3.5" /></button><button aria-label="Visualizar em lista" aria-pressed={layout === 'list'} onClick={() => setLayout('list')} className={`rounded-md p-1.5 ${layout === 'list' ? 'bg-[#eaf1e7] text-forest' : 'text-muted'}`}><Icon name="list" className="size-3.5" /></button></div></div></div>
      {isError && view !== 'pokedex' && <div role="alert" className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900"><Icon name="info" className="size-4 shrink-0" /><span className="flex-1">Não foi possível carregar sua coleção. {view === 'favorites' ? 'Os favoritos do catálogo continuam disponíveis.' : 'Confira se o servidor está disponível e tente novamente.'}</span><button disabled={isFetching} onClick={() => refetch()} className="font-bold underline underline-offset-4 disabled:opacity-50">{isFetching ? 'Tentando…' : 'Tentar novamente'}</button></div>}
      {loading ? <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl border border-line bg-[#e9ede5]" />)}</div> : visible.length ? <div className={layout === 'grid' ? 'grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' : 'grid grid-cols-1 gap-3 xl:grid-cols-2'}>{visible.map((pokemon, index) => <PokemonCard key={pokemon.key} pokemon={pokemon} index={index} layout={layout} favorite={favorites.includes(pokemon.key)} onFavorite={toggleFavorite} onOpen={setSelected} />)}</div> : !(view === 'collection' && isError) && <div className="rounded-2xl border border-dashed border-[#ccd6c6] bg-white/60 px-5 py-16 text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#eaf1e7] text-forest"><Icon name={view === 'favorites' ? 'heart' : 'search'} className="size-7" /></span><h2 className="mt-5 text-lg font-bold">{search || type !== 'all' ? 'Nenhum Pokémon por aqui' : view === 'favorites' ? 'Seus favoritos começam com um coração' : 'Uma coleção cheia de possibilidades'}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{search || type !== 'all' ? 'Experimente outro nome, número ou tipo para continuar explorando.' : view === 'favorites' ? 'Toque no coração de um Pokémon para encontrá-lo aqui sempre que quiser.' : 'Cadastre seu primeiro Pokémon e comece a escrever sua própria jornada.'}</p>{search || type !== 'all' ? <button onClick={clearFilters} className="primary-button mt-5">Limpar busca e filtros</button> : <Link className="primary-button mt-5" to={view === 'favorites' ? '/' : '/pokemon'}>{view === 'favorites' ? 'Explorar Pokédex' : 'Cadastrar Pokémon'}<Icon name="arrow-right" className="size-4" /></Link>}</div>}
      {matches.length > 0 && <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="text-[10px] text-muted">Mostrando <strong className="font-semibold text-ink">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, matches.length)}</strong> de {matches.length} Pokémon</p><nav aria-label="Paginação" className="flex items-center gap-1.5"><button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior" className="icon-button size-8 rounded-lg border border-line bg-white disabled:opacity-30"><Icon name="chevron-left" className="size-3.5" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).filter((number) => number === 1 || number === pageCount || Math.abs(number - currentPage) <= 1).map((number, index, numbers) => <span className="flex items-center gap-1.5" key={number}>{index > 0 && number - numbers[index - 1] > 1 && <span className="text-muted">…</span>}<button onClick={() => changePage(number)} aria-current={number === currentPage ? 'page' : undefined} aria-label={`Página ${number}`} className={`size-8 rounded-lg text-[11px] font-semibold ${number === currentPage ? 'bg-forest text-white' : 'border border-line bg-white text-muted hover:bg-[#eaf1e7]'}`}>{number}</button></span>)}<button onClick={() => changePage(currentPage + 1)} disabled={currentPage === pageCount} aria-label="Próxima página" className="icon-button size-8 rounded-lg border border-line bg-white disabled:opacity-30"><Icon name="chevron-right" className="size-3.5" /></button></nav></div>}
    </section>
    {selected && <PokemonDetail key={selected.key} pokemon={selected} favorite={favorites.includes(selected.key)} onFavorite={toggleFavorite} onClose={() => setSelected(null)} />}
  </>;
}
