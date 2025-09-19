<script lang="ts">
    import {onMount} from 'svelte'
    import {initRouter} from './router'
    import {route} from './router'
    import MainLayout from "./lib/components/Layout/MainLayout.svelte";
    import Inicio from "./routes/Inicio.svelte";
    import IdeasRouter from "./routes/ideas/IdeasRouter.svelte";
    import {IdeaRoutes} from "./routes/ideas/routes";
    import PropuestasRouter from './routes/propuestas/PropuestasRouter.svelte';
    import {PropuestaRoutes} from './routes/propuestas/routes';
    import ComunidadesRouter from './routes/comunidades/ComunidadesRouter.svelte';
    import { CommunitiesRoutes } from './routes/comunidades/routes';
    import { SvelteToast } from '@zerodevx/svelte-toast';
    import Login from './routes/auth/Login.svelte';
    import Registrar from './routes/auth/Registrar.svelte';
    import Participacion from './routes/Participacion.svelte';

    let loading = true

    onMount(() => {
        initRouter()
    })
</script>

<SvelteToast position="top-center" />
<MainLayout>
    <section class="container mx-auto w-full flex-grow px-4 font-sans">
        {#if (IdeaRoutes.includes($route.name))}
            <IdeasRouter/>
        {:else if (PropuestaRoutes.includes($route.name))}
            <PropuestasRouter/>
        {:else if (CommunitiesRoutes.includes($route.name))}
            <ComunidadesRouter/>
        {:else if $route.name === 'auth-login'}
            <Login/>
        {:else if $route.name === 'auth-registrar'}
            <Registrar/>
        {:else if $route.name === 'participacion'}
            <Participacion/>
        {:else}
            <Inicio/>
        {/if}
    </section>
</MainLayout>

