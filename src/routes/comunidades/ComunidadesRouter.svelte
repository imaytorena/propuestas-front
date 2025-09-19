<script>
  import { route } from '../../router';
  import ComunidadesList from './ComunidadesList.svelte';
  import ComunidadDetail from './ComunidadDetail.svelte';
  import ComunidadEdit from './ComunidadEdit.svelte';
  import ComunidadCreate from './ComunidadCreate.svelte';
</script>

{#if $route.name === 'comunidad-crear'}
  <ComunidadCreate/>
{:else if $route.name === 'comunidad-detalle'}
  <ComunidadDetail/>
{:else if $route.name === 'comunidad-editar'}
  <ComunidadEdit/>
{:else}
  <ComunidadesList/>
{/if}
