<script lang="ts">
  import PersonChip from './PersonChip.svelte'

  interface Props<T = any> {
    items: T[]
    limite?: number
    obtenerNombre?: (t: T) => string
    obtenerCorreo?: (t: T) => string
    obtenerAvatar?: (t: T) => string | undefined
    hrefDe?: (t: T) => string | undefined
  }
  let { items = [], limite = 10, obtenerNombre = (x:any)=>String(x?.nombre ?? ''), obtenerCorreo = (x:any)=>String(x?.correo ?? ''), obtenerAvatar = (_:any)=>'', hrefDe = (_:any)=>'' }: Props = $props()
  let verTodo = $state(false)

  let visibles = $derived(verTodo ? items : items.slice(0, limite))
</script>

<div class="space-y-3">
  {#each visibles as it}
    <PersonChip nombre={obtenerNombre(it)} correo={obtenerCorreo(it)} avatarUrl={obtenerAvatar(it) || ''} href={hrefDe(it) || ''} clickable={!!hrefDe(it)} />
  {/each}
  {#if items.length > limite}
    <button class="btn btn-ghost btn-sm" on:click={() => verTodo = !verTodo}>
      {verTodo ? 'Ver menos' : `Ver ${items.length - limite} más`}
    </button>
  {/if}
</div>
