<script>
    // Obtener el año actual para el copyright
    import {IdeaRoutes} from "../../../routes/ideas/routes.ts";
    import {route} from '../../../router.js'
    import {UsuarioRoutes} from "../../../routes/usuario/routes.ts";
    import {guardedGoto} from "../../../utils/authGuard.js";

    const currentYear = new Date().getFullYear();

</script>

<footer class="text-black border-t border-gray-700 py-12 mt-8">
    <div class="container mx-auto px-4">
        <div class="text-base-content grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Logo y descripción -->
            <div class="space-y-4">
                <h3 class="text-xl font-bold">ColectividApp</h3>
                <p class="text-base-content/50 text-sm">
                    Plataforma digital para conectar a estudiantes interesados en resolver
                    problemas sociales concretos que afectan tanto a su entorno académico
                    como a sus comunidades locales.
                </p>
            </div>

            <!-- Enlaces rápidos -->
            <div class="space-y-4">
                <h4 class="text-lg font-semibold">Enlaces Rápidos</h4>
                <ul class="space-y-2 text-gray-600">
                    <li><a href="/" class="text-base-content/50 link hover:underline transition-colors">Inicio</a></li>
                    <li><a href="/usuario"
                           onclick={(e) => guardedGoto('/usuario', e)}
                           class="text-base-content/50 link hover:underline transition-colors"
                           class:active={UsuarioRoutes.includes($route.name)}
                    >Usuario</a></li>
                    <li><a href="/ideas"
                           class="text-base-content/50 link hover:underline transition-colors"
                           class:active={IdeaRoutes.includes($route.name)}
                    >Ideas</a></li>
                    <li><a href="/participacion"
                           class="text-base-content/50 link hover:underline transition-colors"
                           class:active={[...IdeaRoutes].includes($route.name)}
                    >Participación</a>
                    </li>
                </ul>
            </div>

            <!-- Redes sociales -->
            <div class="space-y-4">
                <h4 class="text-lg font-semibold">Contacto</h4>
                <div class="flex flex-col gap-2 space-x-4">
                    <a href="https://instagram.com/colectividapp" class="text-base-content/50 hover:underline transition-colors"
                       target="_blank" rel="noopener"
                       aria-label="Contacto por Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M16 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0"/>
                            <path fill="currentColor" fill-rule="evenodd"
                                  d="M12 7.25a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5M8.75 12a3.25 3.25 0 1 1 6.5 0a3.25 3.25 0 0 1-6.5 0"
                                  clip-rule="evenodd"/>
                            <path fill="currentColor" fill-rule="evenodd"
                                  d="M17.258 2.833a47.7 47.7 0 0 0-10.516 0c-2.012.225-3.637 1.81-3.873 3.832a46 46 0 0 0 0 10.67c.236 2.022 1.86 3.607 3.873 3.832a47.8 47.8 0 0 0 10.516 0c2.012-.225 3.637-1.81 3.873-3.832a46 46 0 0 0 0-10.67c-.236-2.022-1.86-3.607-3.873-3.832m-10.35 1.49a46.2 46.2 0 0 1 10.184 0c1.33.15 2.395 1.199 2.55 2.517a44.4 44.4 0 0 1 0 10.32a2.89 2.89 0 0 1-2.55 2.516a46.2 46.2 0 0 1-10.184 0a2.89 2.89 0 0 1-2.55-2.516a44.4 44.4 0 0 1 0-10.32a2.89 2.89 0 0 1 2.55-2.516"
                                  clip-rule="evenodd"/>
                        </svg>
                    </a>
                    <a href="colectividapp@gmail.com" class="text-base-content/50 hover:underline transition-colors">
                        mailto:dev
                    </a>
                </div>
            </div>
        </div>

        <!-- Línea divisoria -->
        <div class="border-t border-gray-600 my-8"></div>

        <!-- Copyright -->
        <div class="text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} ColectividApp. Todos los derechos reservados.</p>
        </div>
    </div>
</footer>

<style>
    .link.active {
        color: var(--color-primary);
    }
</style>