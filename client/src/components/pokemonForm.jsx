import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { createPokemon, getPokemon, updatePokemon } from "../../services/pokemonService";
import Icon from "./Icon";

const pokemonTypes = [
  ["grass", "Planta"], ["fire", "Fogo"], ["water", "Água"],
  ["electric", "Elétrico"], ["bug", "Inseto"], ["normal", "Normal"],
  ["poison", "Veneno"], ["ground", "Terrestre"], ["flying", "Voador"],
  ["psychic", "Psíquico"], ["rock", "Pedra"], ["ghost", "Fantasma"],
  ["ice", "Gelo"], ["dragon", "Dragão"], ["dark", "Sombrio"],
  ["steel", "Aço"], ["fairy", "Fada"], ["fighting", "Lutador"],
];
const defaultValues = { name: "", type: "", level: 1 };
const inputClass = "mt-2 w-full rounded-xl border border-stone-200 bg-[#fcfcfa] px-4 py-3.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#245b45] focus:ring-3 focus:ring-[#245b45]/10 disabled:opacity-60";

export default function PokemonForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({ defaultValues });
  const values = useWatch({ control });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => getPokemon(id),
    enabled: Boolean(id),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    reset(id && data ? { name: data.name ?? "", type: data.type ?? "", level: data.level ?? 1 } : defaultValues);
  }, [data, id, reset]);

  const mutation = useMutation({
    mutationFn: (formData) => id ? updatePokemon(id, formData) : createPokemon(formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pokemon"] });
      navigate("/colecao", {
        state: { success: id ? "Pokémon atualizado com sucesso!" : "Pokémon cadastrado com sucesso!" },
      });
    },
  });
  const selectedType = pokemonTypes.find(([value]) => value === values.type)?.[1] || values.type;
  const legacyType = data?.type && !pokemonTypes.some(([value]) => value === data.type) ? data.type : null;
  const previewLevel = Math.min(100, Math.max(1, Number(values.level) || 1));

  function onSubmit(formData) {
    mutation.mutate({ ...formData, name: formData.name.trim() });
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-9 lg:px-12 lg:py-10">
      <Link to="/colecao" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-[#245b45]">
        <Icon name="arrow-left" className="size-4" />
        Voltar para a coleção
      </Link>
      <div className="mb-8">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#245b45]">Sua jornada Pokémon</p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-800 sm:text-4xl">{id ? "Editar Pokémon" : "Um novo companheiro."}</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">{id ? "Atualize as informações deste Pokémon na sua coleção." : "Cada descoberta merece um lugar na sua Pokédex."}</p>
      </div>
      {id && isLoading ? (
        <div role="status" className="flex min-h-72 items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white text-sm text-stone-500">
          <Icon name="loader" className="size-5 animate-spin" /> Carregando Pokémon...
        </div>
      ) : id && isError ? (
        <div role="alert" className="rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-stone-800">Não foi possível encontrar este Pokémon.</h2>
          <p className="mt-2 text-sm text-stone-500">Verifique sua conexão e tente novamente.</p>
          <button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-[#245b45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#194331]">Tentar novamente</button>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
            <div className="border-b border-stone-100 px-6 py-5 sm:px-8">
              <h2 className="font-semibold text-stone-800">Informações do Pokémon</h2>
              <p className="mt-1 text-xs leading-5 text-stone-500">Preencha todos os campos para {id ? "salvar as alterações" : "adicionar à sua coleção"}.</p>
            </div>
            <fieldset disabled={mutation.isPending} className="space-y-6 px-6 py-7 sm:px-8">
              <div>
                <label htmlFor="pokemon-name" className="text-sm font-semibold text-stone-700">Nome do Pokémon <span className="text-[#245b45]">*</span></label>
                <input id="pokemon-name" placeholder="Ex.: Bulbasaur" autoComplete="off" maxLength={40}
                  aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "pokemon-name-error" : "pokemon-name-hint"}
                  className={inputClass}
                  {...register("name", {
                    required: "Informe o nome do Pokémon.",
                    validate: (value) => (value.trim().length >= 2 && value.trim().length <= 40) || "O nome deve ter entre 2 e 40 caracteres.",
                  })}
                />
                {errors.name ? <p id="pokemon-name-error" role="alert" className="mt-2 text-xs text-red-600">{errors.name.message}</p> : <p id="pokemon-name-hint" className="mt-2 text-xs text-stone-400">Use o nome da espécie ou um apelido especial.</p>}
              </div>
              <div className="grid gap-6 sm:grid-cols-[1fr_150px]">
                <div>
                  <label htmlFor="pokemon-type" className="text-sm font-semibold text-stone-700">Tipo principal <span className="text-[#245b45]">*</span></label>
                  <select id="pokemon-type" className={inputClass} aria-invalid={Boolean(errors.type)}
                    aria-describedby={errors.type ? "pokemon-type-error" : undefined}
                    {...register("type", { required: "Selecione um tipo." })}
                  >
                    <option value="" disabled>Selecione o tipo</option>
                    {pokemonTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    {legacyType && <option value={legacyType}>{legacyType}</option>}
                  </select>
                  {errors.type && <p id="pokemon-type-error" role="alert" className="mt-2 text-xs text-red-600">{errors.type.message}</p>}
                </div>
                <div>
                  <label htmlFor="pokemon-level" className="text-sm font-semibold text-stone-700">Nível <span className="text-[#245b45]">*</span></label>
                  <input id="pokemon-level" type="number" min={1} max={100} step={1} inputMode="numeric" className={inputClass}
                    aria-invalid={Boolean(errors.level)} aria-describedby={errors.level ? "pokemon-level-error" : "pokemon-level-hint"}
                    {...register("level", {
                      valueAsNumber: true,
                      required: "Informe o nível.",
                      min: { value: 1, message: "O nível mínimo é 1." },
                      max: { value: 100, message: "O nível máximo é 100." },
                      validate: (value) => Number.isInteger(value) || "Use um número inteiro.",
                    })}
                  />
                  {errors.level ? <p id="pokemon-level-error" role="alert" className="mt-2 text-xs text-red-600">{errors.level.message}</p> : <p id="pokemon-level-hint" className="mt-2 text-xs text-stone-400">Entre 1 e 100.</p>}
                </div>
              </div>
              {mutation.isError && (
                <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  Não foi possível salvar o Pokémon. Verifique sua conexão e tente novamente. Seus dados continuam aqui.
                </p>
              )}
              <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:justify-end">
                <Link to="/colecao" className="rounded-xl border border-stone-200 px-5 py-3 text-center text-sm font-semibold text-stone-600 transition hover:bg-stone-50">Cancelar</Link>
                <button type="submit" disabled={mutation.isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#245b45] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#194331] disabled:cursor-wait disabled:opacity-70">
                  <Icon name={mutation.isPending ? "loader" : id ? "check" : "plus"} className={"size-4 " + (mutation.isPending ? "animate-spin" : "")} />
                  {mutation.isPending ? "Salvando..." : id ? "Salvar alterações" : "Adicionar Pokémon"}
                </button>
              </div>
            </fieldset>
          </form>
          <aside className="relative overflow-hidden rounded-2xl bg-[#245b45] p-7 text-white">
            <Icon name="pokeball" className="pointer-events-none absolute -right-16 -top-12 size-60 rotate-12 opacity-[0.06]" />
            <p className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Próximo capítulo</p>
            <div className="relative my-8 flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <Icon name="pokeball" className="size-9 text-[#d9e9ba]" />
            </div>
            <h2 className="relative break-words text-2xl font-bold tracking-tight">{values.name?.trim() || "Uma nova descoberta"}</h2>
            <p className="relative mt-3 text-sm leading-6 text-white/65">Um parceiro para explorar, aprender e evoluir com você.</p>
            <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-white/15 pt-5 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1.5 font-medium">{selectedType || "Tipo a descobrir"}</span>
              <span className="shrink-0 font-medium text-white/70">Nível {previewLevel}</span>
            </div>
            <div aria-hidden="true" className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#c7dc9c] transition-all" style={{ width: previewLevel + "%" }} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
