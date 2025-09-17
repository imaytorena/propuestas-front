<script lang="ts">
    import {onMount} from 'svelte'
    import {initRouter} from './router'
    import RouteView from './lib/RouteView.svelte'
    import ParticipacionTabs from "./lib/Layout/ParticipacionTabs.svelte";
    import {route} from './router'
    import MainLayout from "./lib/Layout/MainLayout.svelte";
    import Inicio from "./routes/Inicio.svelte";
    import IdeaDetail from "./routes/ideas/IdeaDetail.svelte";
    import IdeasList from "./routes/ideas/IdeasList.svelte";
    import IdeaEdit from "./routes/ideas/IdeaEdit.svelte";
    import IdeasRouter from "./routes/ideas/IdeasRouter.svelte";
    import {IdeaRoutes} from "./routes/ideas/routes";

    let loading = true

    onMount(() => {
        initRouter()
    })
</script>

<MainLayout>
    <section class="container mx-auto w-full flex-grow px-4 font-mono">
        {#if (IdeaRoutes.includes($route.name))}
            <IdeasRouter/>
        {:else}
            <p>Bienvenido. Usa el menú para navegar.</p>
            <Inicio/>
        {/if}
    </section>
</MainLayout>

