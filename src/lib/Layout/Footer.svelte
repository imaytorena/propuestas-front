<script>
    // Obtener el año actual para el copyright
    import {IdeaRoutes} from "../../routes/ideas/routes.js";
    import {route} from '../../router'
    import {UsuarioRoutes} from "../../routes/usuario/routes.js";

    const currentYear = new Date().getFullYear();

</script>

<footer class="text-black border-t border-gray-700 py-12 mt-8">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Logo y descripción -->
            <div class="space-y-4">
                <h3 class="text-xl font-bold">ColectividApp</h3>
                <p class="text-gray-600 text-sm">
                    Plataforma digital para conectar a estudiantes interesados en resolver problemas sociales concretos
                    que
                    afectan tanto a su entorno académico como a sus comunidades locales.
                </p>
            </div>

            <!-- Enlaces rápidos -->
            <div class="space-y-4">
                <h4 class="text-lg font-semibold">Enlaces Rápidos</h4>
                <ul class="space-y-2 text-gray-600">
                    <li><a href="/" class="link hover:underline transition-colors">Inicio</a></li>
                    <li><a href="/usuario"
                           class="link hover:underline transition-colors"
                           class:active={UsuarioRoutes.includes($route.name)}
                    >Usuario</a></li>
                    <li><a href="/ideas"
                           class="link hover:underline transition-colors"
                           class:active={IdeaRoutes.includes($route.name)}
                    >Ideas</a></li>
                    <li><a href="/participacion"
                           class="link hover:underline transition-colors"
                           class:active={[...IdeaRoutes].includes($route.name)}
                    >Participación</a>
                    </li>
                </ul>
            </div>

            <!-- Redes sociales -->
            <div class="space-y-4">
                <h4 class="text-lg font-semibold">Contacto</h4>
                <div class="flex space-x-4">
                    <a href="https://api.whatsapp.com/send?phone=5233333333333&text=Holi"
                       class="text-gray-600 hover:underline transition-colors" aria-label="Contacto por WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M8.886 7.17c.183.005.386.015.579.443c.128.285.343.81.519 1.238c.137.333.249.607.277.663c.064.128.104.275.02.448l-.028.058a1.4 1.4 0 0 1-.23.37l-.143.17c-.085.104-.17.206-.242.278c-.129.128-.262.266-.114.522s.668 1.098 1.435 1.777a6.6 6.6 0 0 0 1.903 1.2q.105.045.17.076c.257.128.41.108.558-.064c.149-.173.643-.749.817-1.005c.168-.256.34-.216.578-.128c.238.089 1.504.71 1.761.837l.143.07c.179.085.3.144.352.23c.064.109.064.62-.148 1.222c-.218.6-1.267 1.176-1.742 1.22l-.135.016c-.436.052-.988.12-2.956-.655c-2.426-.954-4.027-3.32-4.35-3.799l-.053-.076l-.006-.008c-.147-.197-1.048-1.402-1.048-2.646c0-1.19.587-1.81.854-2.092l.047-.05a.95.95 0 0 1 .687-.32c.173 0 .347 0 .495.005"/>
                            <path fill="currentColor" fill-rule="evenodd"
                                  d="M2.184 21.331a.4.4 0 0 0 .487.494l4.607-1.204a10 10 0 0 0 4.76 1.207h.004c5.486 0 9.958-4.446 9.958-9.912a9.83 9.83 0 0 0-2.914-7.011A9.92 9.92 0 0 0 12.042 2c-5.486 0-9.958 4.446-9.958 9.911c0 1.739.458 3.447 1.33 4.954zm2.677-4.068a1.5 1.5 0 0 0-.148-1.15a8.4 8.4 0 0 1-1.129-4.202c0-4.63 3.793-8.411 8.458-8.411c2.27 0 4.388.877 5.986 2.468a8.33 8.33 0 0 1 2.472 5.948c0 4.63-3.793 8.412-8.458 8.412h-.005a8.5 8.5 0 0 1-4.044-1.026a1.5 1.5 0 0 0-1.094-.132l-2.762.721z"
                                  clip-rule="evenodd"/>
                        </svg>
                    </a>
                    <a href="#" class="text-gray-600 hover:underline transition-colors"
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