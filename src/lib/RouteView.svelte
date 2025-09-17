<script lang="ts">
  import { route } from '../router'
  import IdeasList from '../routes/IdeasList.svelte'
  import IdeaDetail from '../routes/IdeaDetail.svelte'
  import IdeaEdit from '../routes/IdeaEdit.svelte'
</script>

{#if $route.name === 'ideas-list'}
  <IdeasList />
{:else if $route.name === 'idea-detail'}
  <IdeaDetail />
{:else if $route.name === 'idea-edit'}
  <IdeaEdit />
{:else}
  <p>Bienvenido. Usa el menú para navegar.</p>
{/if}
