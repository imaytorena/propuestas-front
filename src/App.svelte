<script lang="ts">
    import {onMount} from 'svelte'
    import {initRouter} from './router'
    import {route} from './router'
    import MainLayout from "./lib/components/Layout/MainLayout.svelte";
    import Inicio from "./routes/Inicio.svelte";
    import IdeasRouter from "./routes/ideas/IdeasRouter.svelte";
    import {IdeaRoutes} from "./routes/ideas/routes";
    import { Toaster } from 'svelte-french-toast';

    let loading = true

    onMount(() => {
        initRouter()
    })
</script>

<Toaster position="top-center" richColors/>
<MainLayout>
    <section class="container mx-auto w-full flex-grow px-4 font-sans">
        {#if (IdeaRoutes.includes($route.name))}
            <IdeasRouter/>
        {:else}
            <Inicio/>
        {/if}
    </section>
</MainLayout>

