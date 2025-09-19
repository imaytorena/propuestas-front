<script>
  import { route } from '../../router';
  import PropuestasList from './PropuestasList.svelte';
  import PropuestaDetail from './PropuestaDetail.svelte';
  import PropuestaEdit from './PropuestaEdit.svelte';
  import PropuestaCreate from './PropuestaCreate.svelte';
</script>

{#if $route.name === 'propuesta-crear'}
  <PropuestaCreate/>
{:else if $route.name === 'propuesta-detalle'}
  <PropuestaDetail/>
{:else if $route.name === 'propuesta-editar'}
  <PropuestaEdit/>
{:else}
  <PropuestasList/>
{/if}
