import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import PokemonList from './pages/pokemonList';
import PokemonForm from './components/pokemonForm';
import Icon from './components/Icon';

function AppLayout() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pokedex-favorites') || '[]');
      return Array.isArray(saved) ? saved.filter((key) => typeof key === 'string') : [];
    } catch { return []; }
  });
  const [storageError, setStorageError] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuButton = useRef(null);
  const sidebar = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!mobileMenu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sidebar.current?.querySelector('a')?.focus();
    function handleKey(event) {
      if (event.key === 'Escape') { setMobileMenu(false); menuButton.current?.focus(); }
      if (event.key === 'Tab') {
        const links = sidebar.current?.querySelectorAll('a, button');
        if (!links?.length) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', handleKey);
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event) => { if (event.matches) setMobileMenu(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [mobileMenu]);

  function toggleFavorite(key) {
    const next = favorites.includes(key) ? favorites.filter((item) => item !== key) : [...favorites, key];
    setFavorites(next);
    try { localStorage.setItem('pokedex-favorites', JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }

  const navigation = [
    { to: '/', icon: 'pokeball', label: 'Pokédex' },
    { to: '/favoritos', icon: 'heart', label: 'Favoritos', count: favorites.length },
    { to: '/colecao', icon: 'collection', label: 'Minha coleção' },
  ];

  return (
    <div className="min-h-screen lg:flex">
      <a className="fixed top-3 left-3 z-60 -translate-y-24 rounded-lg bg-forest px-4 py-3 text-white focus:translate-y-0" href="#conteudo">Pular para o conteúdo</a>
      {mobileMenu && <button aria-label="Fechar menu" className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setMobileMenu(false)} />}
      <aside ref={sidebar} className={`${mobileMenu ? 'visible translate-x-0' : 'invisible -translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-y-auto border-r border-line bg-white px-5 transition-transform lg:visible lg:w-56 lg:translate-x-0 xl:w-60`}>
        <button className="icon-button absolute top-2 right-2 lg:hidden" aria-label="Fechar navegação" onClick={() => { setMobileMenu(false); menuButton.current?.focus(); }}><Icon name="close" className="size-4" /></button>
        <Link to="/" onClick={() => setMobileMenu(false)} aria-label="Pokédex, início" className="flex items-center gap-2.5 px-3 pt-9 pb-12">
          <span className="flex size-10 items-center justify-center rounded-full bg-forest text-white"><Icon name="pokeball" className="size-7" /></span>
          <span className="text-[26px] font-extrabold tracking-[-1.5px]">pokédex<span className="text-[#71a474]">.</span></span>
        </Link>
        <p className="mb-3 px-4 text-[10px] font-bold tracking-[2px] text-[#a1aaa2]">EXPLORE O UNIVERSO</p>
        <nav aria-label="Navegação principal" className="space-y-1.5">
          {navigation.map(({ to, icon, label, count }) => <NavLink key={to} to={to} end onClick={() => setMobileMenu(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon name={icon} /><span>{label}</span>{count > 0 && <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[10px]">{count}</span>}</NavLink>)}
        </nav>
        <div className="mx-4 my-7 h-px bg-line" />
        <Link to="/pokemon" onClick={() => setMobileMenu(false)} className={`nav-link ${location.pathname.startsWith('/pokemon') ? 'active' : ''}`}><Icon name="plus" />Cadastrar Pokémon</Link>
        <div className="mt-auto pt-12 pb-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#f0f4e9] px-4 pt-5 pb-4">
            <Icon name="leaf" className="mb-3 size-6 text-forest" />
            <p className="text-sm font-bold">Toda aventura começa<br />com uma descoberta.</p>
            <p className="mt-2 text-xs leading-5 text-muted">Seu próximo Pokémon favorito está por aqui.</p>
            <Link to="/favoritos" onClick={() => setMobileMenu(false)} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-forest">Ver meus favoritos <Icon name="arrow-right" className="size-3.5" /></Link>
          </div>
          <div className="mt-6 flex items-center gap-3 px-2"><span className="flex size-9 items-center justify-center rounded-full border border-line bg-canvas text-forest"><Icon name="compass" className="size-5" /></span><div><p className="text-xs font-bold">Espírito de treinador</p><p className="mt-0.5 text-[10px] text-muted">Sempre pronto para explorar</p></div></div>
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:ml-56 xl:ml-60">
        <header className="flex h-[76px] items-center justify-between border-b border-line bg-white/70 px-5 sm:px-8 xl:px-10">
          <div className="flex items-center gap-3"><button ref={menuButton} className="icon-button lg:hidden" aria-label="Abrir menu" aria-expanded={mobileMenu} onClick={() => setMobileMenu(true)}><Icon name="menu" /></button><span className="hidden text-xs text-muted sm:inline">Um mundo de descobertas,</span><span className="text-xs font-semibold text-ink">uma Pokédex só sua.</span></div>
          <span className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-semibold text-muted"><span className="size-1.5 rounded-full bg-[#80a877]" />Projeto de fã <Icon name="pokeball" className="size-3.5" /></span>
        </header>
        <main id="conteudo" className="mx-auto max-w-[1480px] px-5 pt-8 pb-6 sm:px-8 xl:px-10">
          {storageError && <p role="status" className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Seus favoritos estão disponíveis nesta sessão. O navegador não permitiu salvá-los.</p>}
          <Outlet context={{ favorites, toggleFavorite }} />
          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-[10px] text-muted"><span className="flex items-center gap-1.5">Feito para quem nunca deixou de explorar. <Icon name="leaf" className="size-3" /></span><span>Pokémon © Nintendo / Creatures / GAME FREAK · Dados: <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:text-forest">PokéAPI</a></span></footer>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <BrowserRouter><Routes><Route element={<AppLayout />}><Route path="/" element={<PokemonList key="pokedex" view="pokedex" />} /><Route path="/favoritos" element={<PokemonList key="favorites" view="favorites" />} /><Route path="/colecao" element={<PokemonList key="collection" view="collection" />} /><Route path="/pokemon" element={<PokemonForm />} /><Route path="/pokemon/:id" element={<PokemonForm />} /><Route path="*" element={<div className="py-24 text-center"><Icon name="compass" className="mx-auto mb-4 size-12 text-forest" /><h1 className="text-3xl font-bold">Fora da rota!</h1><p className="mt-3 text-muted">Esta página não foi encontrada.</p><Link to="/" className="primary-button mt-6">Voltar à Pokédex</Link></div>} /></Route></Routes></BrowserRouter>;
}
