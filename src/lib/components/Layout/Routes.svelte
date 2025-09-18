<script lang="ts">
    import {route} from '../../../router'
    import {getContext} from 'svelte';
    import {IdeaRoutes} from "../../../routes/ideas/routes";

    const session = getContext('session');
    const currentRoute = $derived($route.name);
    const showLoginOption = $derived(!!(!session && !($route.name === 'auth-login' || $route.name === 'auth-registrar')));
    const userIsLogged = $derived(!!session);

    $effect(() => {
        console.log(showLoginOption)
        console.log(currentRoute)
    })
</script>

<!--<div>-->
<li id="inicio" class="snap-start  flex justify-center items-center">
    <a
            href="/public"
            class="btn-link no-underline"
            class:active={currentRoute === 'inicio'}>
        <span class="hidden md:block">Inicio</span>
        <span class="block md:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                           viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path
                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path
                fill="currentColor"
                d="M10.772 2.688a2 2 0 0 1 2.456 0l8.384 6.52c.753.587.337 1.792-.615 1.792H20v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8h-.997c-.953 0-1.367-1.206-.615-1.791zM5.625 9.225c.229.185.375.468.375.785V19h12v-8.99c0-.317.146-.6.375-.785L12 4.267z"/></g></svg></span>
    </a>
</li>
<li id="participacion" class="snap-start flex justify-center items-center">
    <a
            href="/participacion"
            class="btn-link no-underline"
            class:active={['participacion', 'propuestas', 'actividades',...IdeaRoutes].includes($route.name)}>
        <span class="hidden md:block">Participación</span>
        <span class="block md:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                           viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path
                d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path
                fill="currentColor"
                d="M7 3a4 4 0 0 1 4 4v3a1 1 0 0 1-1 1H7a4 4 0 1 1 0-8m2 4a2 2 0 1 0-2 2h2zm5 4a1 1 0 0 1-1-1V7a4 4 0 1 1 4 4zm1-4v2h2a2 2 0 1 0-2-2m6 10a4 4 0 0 0-4-4h-3a1 1 0 0 0-1 1v3a4 4 0 0 0 8 0m-4-2a2 2 0 1 1-2 2v-2zm-7-2a1 1 0 0 1 1 1v3a4 4 0 1 1-4-4zm-1 4v-2H7a2 2 0 1 0 2 2"/></g></svg></span>
    </a>
</li>
<li id="comunidades" class="snap-start flex justify-center items-center">
    <a
            href="/comunidades"
            class="btn-link no-underline"
            class:active={(currentRoute === 'comunidades')}>
        <span class="hidden md:block">Comunidades</span>
        <span class="block md:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                           viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path
                d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path
                fill="currentColor"
                d="M12 12c1.873 0 3.57.62 4.815 1.487c1.183.825 2.185 2.051 2.185 3.37c0 .724-.309 1.324-.796 1.77c-.458.421-1.056.694-1.672.88C15.301 19.88 13.68 20 12 20s-3.301-.12-4.532-.493c-.616-.186-1.214-.459-1.673-.88C5.31 18.182 5 17.582 5 16.858c0-1.319 1.002-2.545 2.185-3.37C8.43 12.62 10.127 12 12 12m0 2c-1.44 0-2.743.48-3.67 1.127c-.989.69-1.33 1.392-1.33 1.73c0 .304.352.494.672.614l.205.07l.17.052c.94.284 2.32.407 3.953.407c1.508 0 2.799-.105 3.728-.344l.304-.087l.19-.06c.343-.117.778-.314.778-.652s-.341-1.04-1.33-1.73C14.744 14.481 13.44 14 12 14m7-1c1.044 0 1.992.345 2.693.833c.64.447 1.307 1.19 1.307 2.096c0 1.335-1.297 1.813-2.463 1.98l-.3.037l-.289.025l-.138.008c.122-.345.19-.72.19-1.122a3.8 3.8 0 0 0-.107-.888c.386-.03.703-.08.939-.151c.104-.032.01-.13-.1-.215l-.107-.078l-.076-.051a2.7 2.7 0 0 0-.995-.418c-.38-.76-.964-1.418-1.586-1.943A4.8 4.8 0 0 1 19 13M5 13q.537.002 1.032.113c-.622.525-1.206 1.183-1.586 1.943a2.7 2.7 0 0 0-.995.418l-.128.088c-.127.092-.276.22-.155.256c.236.071.553.122.94.151a3.7 3.7 0 0 0-.108.888c0 .402.068.777.19 1.122l-.28-.02l-.296-.03c-1.202-.147-2.614-.607-2.614-2c0-.905.666-1.649 1.307-2.096A4.76 4.76 0 0 1 5 13m13.5-6a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m-13 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5M12 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8m6.5 6a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1m-13 0a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1M12 5a2 2 0 1 0 0 4a2 2 0 0 0 0-4"/></g></svg></span>
    </a>
</li>
<!-- Si no hay sesión y no se está en login o regustrar-->
{#if showLoginOption}
    <li id="login" class="flex flex-col justify-center snap-start">
        <a
                href="/auth/login"
                aria-label="Iniciar sesión"
                class="btn-link flex items-center text-black no-underline"
        >

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            >
                <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M4 12h16m0 0l-6-6m6 6l-6 6"
                />
            </svg
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="30" viewBox="0 0 24 24">
                <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M9 6.25a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M7.75 9a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0M9 12.25c-1.196 0-2.315.24-3.164.665c-.803.402-1.586 1.096-1.586 2.085v.063c-.002.51-.004 1.37.81 1.959c.378.273.877.448 1.495.559c.623.112 1.422.169 2.445.169s1.822-.057 2.445-.169c.618-.111 1.117-.286 1.495-.56c.814-.589.812-1.448.81-1.959V15c0-.99-.783-1.683-1.586-2.085c-.849-.424-1.968-.665-3.164-.665M5.75 15c0-.115.113-.421.757-.743c.6-.3 1.48-.507 2.493-.507s1.894.207 2.493.507c.644.322.757.628.757.743c0 .604-.039.697-.19.807c-.122.088-.373.206-.88.298c-.502.09-1.203.145-2.18.145s-1.678-.055-2.18-.145c-.507-.092-.758-.21-.88-.298c-.152-.11-.19-.203-.19-.807"
                        clip-rule="evenodd"
                />
                <path
                        fill="currentColor"
                        d="M19 12.75a.75.75 0 0 0 0-1.5h-4a.75.75 0 0 0 0 1.5zM19.75 9a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1 0-1.5h5a.75.75 0 0 1 .75.75M19 15.75a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0 0 1.5z"
                />
                <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M9.944 3.25h4.112c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.945c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153M5.71 4.89c-1.006.135-1.586.389-2.01.812c-.422.423-.676 1.003-.811 2.009c-.138 1.028-.14 2.382-.14 4.289s.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.028.14-2.382.14-4.289s-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14"
                        clip-rule="evenodd"
                />
            </svg>
        </a>
    </li>
    <!--  Si el usuario tiene una sesión o está en login o registrar  -->
{:else if userIsLogged}
    <li id="usuarios" class="flex flex-col justify-center snap-start">
        <!--  Si el usuario tiene una sesión y está en la ruta usuarios  -->
        {#if (currentRoute === 'usuario-detalle' || currentRoute === 'usuario-editar')}
            <div class="btn-link"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="30" viewBox="0 0 24 24"
                >
                    <path
                            fill="currentColor"
                            fill-rule="evenodd"
                            d="M10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12s0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12s0-5.657 1.172-6.828S6.229 4 10 4m3.25 5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75M11 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2 8c4 0 4-.895 4-2s-1.79-2-4-2s-4 .895-4 2s0 2 4 2"
                            clip-rule="evenodd"
                    />
                </svg>
            </div>
            <!--  Si el usuario tiene una sesión y no está en la ruta usuarios  -->
        {:else}
            <a
                    id="usuario" href="/usuario"
                    aria-label="Perfil del usuario"
                    class="btn-link flex items-center text-black no-underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="30" viewBox="0 0 24 24"
                >
                    <path
                            fill="currentColor"
                            fill-rule="evenodd"
                            d="M9 6.25a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M7.75 9a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0M9 12.25c-1.196 0-2.315.24-3.164.665c-.803.402-1.586 1.096-1.586 2.085v.063c-.002.51-.004 1.37.81 1.959c.378.273.877.448 1.495.559c.623.112 1.422.169 2.445.169s1.822-.057 2.445-.169c.618-.111 1.117-.286 1.495-.56c.814-.589.812-1.448.81-1.959V15c0-.99-.783-1.683-1.586-2.085c-.849-.424-1.968-.665-3.164-.665M5.75 15c0-.115.113-.421.757-.743c.6-.3 1.48-.507 2.493-.507s1.894.207 2.493.507c.644.322.757.628.757.743c0 .604-.039.697-.19.807c-.122.088-.373.206-.88.298c-.502.09-1.203.145-2.18.145s-1.678-.055-2.18-.145c-.507-.092-.758-.21-.88-.298c-.152-.11-.19-.203-.19-.807"
                            clip-rule="evenodd"
                    />
                    <path
                            fill="currentColor"
                            d="M19 12.75a.75.75 0 0 0 0-1.5h-4a.75.75 0 0 0 0 1.5zM19.75 9a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1 0-1.5h5a.75.75 0 0 1 .75.75M19 15.75a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0 0 1.5z"
                    />
                    <path
                            fill="currentColor"
                            fill-rule="evenodd"
                            d="M9.944 3.25h4.112c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.945c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153M5.71 4.89c-1.006.135-1.586.389-2.01.812c-.422.423-.676 1.003-.811 2.009c-.138 1.028-.14 2.382-.14 4.289s.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.028.14-2.382.14-4.289s-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14"
                            clip-rule="evenodd"
                    />
                </svg>
            </a>
        {/if}
    </li>
{:else}
    <!--  Si el usuario no tiene una sesión y está en la ruta login o registrar  -->
    <li
            id="login"
            class="btn-link flex items-center no-underline snap-start"
            class:active={(currentRoute === 'auth-login' || currentRoute === 'auth-registrar')}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        >
            <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 12h16m0 0l-6-6m6 6l-6 6"
            />
        </svg
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="30" viewBox="0 0 24 24"
        >
            <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12s0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12s0-5.657 1.172-6.828S6.229 4 10 4m3.25 5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75M11 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2 8c4 0 4-.895 4-2s-1.79-2-4-2s-4 .895-4 2s0 2 4 2"
                    clip-rule="evenodd"
            />
        </svg>
    </li>
{/if}
<!--</div>-->

<style>
    .btn-link:hover svg {
        border: none;
        text-decoration: none;
    }

    .btn-link:hover {
        color: var(--color-primary);
    }

    .btn-link.active {
        color: var(--color-primary);
        border-bottom: 1px solid var(--color-primary);
    }
</style>
