<script>
    import {route} from '../../router';
    import IdeasList from "./IdeasList.svelte";
    import IdeaDetail from "./IdeaDetail.svelte";
    import IdeaEdit from "./IdeaEdit.svelte";

</script>

{#if $route.name === 'idea-crear'}
    <IdeaDetail/>
{:else if $route.name === 'idea-detalle'}
    <IdeaDetail/>
{:else if $route.name === 'idea-editar'}
    <IdeaEdit/>
{:else }
    <IdeasList/>
{/if}