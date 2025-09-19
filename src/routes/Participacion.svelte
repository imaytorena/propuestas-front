<script lang="ts">
    // Mock data for the blog-like view
    type Card = {
        id: string | number;
        title: string;
        summary: string;
        image?: string;
        href: string;
        tag: string;
    };

    const ideas: Card[] = [
        {
            id: 1,
            title: 'Huertos urbanos en barrios',
            summary: 'Crear pequeños huertos comunitarios para fomentar la soberanía alimentaria y la convivencia.',
            href: '/ideas/1',
            tag: 'Idea'
        },
        {
            id: 2,
            title: 'Rutas seguras a la escuela',
            summary: 'Mapeo participativo para proponer pasos peatonales y señalización en entornos escolares.',
            href: '/ideas/2',
            tag: 'Idea'
        }
    ];

    const propuestas: Card[] = [
        {
            id: 'a',
            title: 'Presupuesto participativo 2025',
            summary: 'Propuesta para destinar el 5% del presupuesto a proyectos vecinales con evaluación ciudadana.',
            image: 'https://images.unsplash.com/photo-1723942093326-47203a1941c3',
            href: '/propuestas',
            tag: 'Propuesta'
        },
        {
            id: 'b',
            title: 'Red de bicis públicas',
            summary: 'Ampliación de ciclovías y estaciones de bicicletas compartidas en zonas clave.',
            image: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf',
            href: '/propuestas',
            tag: 'Propuesta'
        }
    ];

    const actividades: Card[] = [
        {
            id: 'wk1',
            title: 'Taller: compostaje en casa',
            summary: 'Aprende a transformar residuos orgánicos en abono para tus plantas.',
            image: 'https://plus.unsplash.com/premium_photo-1678371210527-7af8f4ae682c',
            href: '/actividades',
            tag: 'Actividad'
        },
        {
            id: 'wk2',
            title: 'Jornada de limpieza de ríos',
            summary: 'Convocatoria abierta para limpiar la ribera del río y aprender sobre su cuidado.',
            image: 'https://traficozmg.com/wp-content/uploads/2025/08/TZMG-GN-6-9.png',
            href: '/actividades',
            tag: 'Actividad'
        }
    ];

    const comunidades: Card[] = [
        {
            id: 'c1',
            title: 'Comunidad Verde Norte',
            summary: 'Vecinas y vecinos organizados por más áreas verdes y sombreado urbano.',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
            href: '/comunidades',
            tag: 'Comunidad'
        },
        {
            id: 'c2',
            title: 'Mejor seguridad',
            summary: 'Laboratorio ciudadano para fabricar soluciones abiertas a problemas locales.',
            image: 'https://traficozmg.com/wp-content/uploads/2025/09/SAUCES-1.jpg',
            href: '/comunidades',
            tag: 'Comunidad'
        }
    ];

    const sections: {
        key: string;
        title: string;
        description: string;
        cta?: { label: string; href: string };
        items: Card[]
    }[] = [
        {
            key: 'ideas',
            title: 'Ideas',
            description: 'Explora ideas ciudadanas para inspirar proyectos.',
            cta: {label: 'Ver todas', href: '/ideas'},
            items: ideas
        },
        {
            key: 'propuestas',
            title: 'Propuestas',
            description: 'Iniciativas concretas para ejecutar con apoyo institucional.',
            cta: {label: 'Ver todas', href: '/propuestas'},
            items: propuestas
        },
        {
            key: 'actividades',
            title: 'Actividades',
            description: 'Eventos y talleres para aprender y actuar en comunidad.',
            cta: {label: 'Calendario', href: '/actividades'},
            items: actividades
        },
        {
            key: 'comunidades',
            title: 'Comunidades',
            description: 'Colectivos y grupos organizados con los que puedes colaborar.',
            cta: {label: 'Explorar', href: '/comunidades'},
            items: comunidades
        }
    ];
</script>

<section class="py-8">
    <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold">Participación</h1>
        <p class="mt-2 text-base-content/70 max-w-2xl mx-auto">
            Descubre ideas, propuestas, actividades y comunidades. Participa con tu voz y manos para mejorar tu ciudad.
        </p>
    </header>

    <div class="space-y-14">
        {#each sections as section}
            <section class="space-y-4">
                <div class="flex items-end justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-semibold">{section.title}</h2>
                        <p class="text-base-content/70">{section.description}</p>
                    </div>
                    {#if section.cta}
                        <a class="btn btn-sm btn-outline" href={section.cta.href}>{section.cta.label}</a>
                    {/if}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each section.items as item}
                        <article class="card bg-base-100 shadow hover:shadow-lg transition-shadow">
                            {#if item.image}
                                <figure class="aspect-[16/9] overflow-hidden">
                                    <img src={item.image} alt={item.title} class="w-full h-full object-cover"
                                         loading="lazy"/>
                                </figure>
                            {/if}
                            <div class="card-body flex flex-col gap-4 p-4">
                                <span class="badge badge-outline badge-primary text-xs self-end">{item.tag}</span>
                                <h3 class="card-title text-lg">{item.title}</h3>
                                <p class="text-sm text-base-content/70">{item.summary}</p>
                                <div class="card-actions justify-end mt-2">
                                    <a href={item.href} class="btn btn-sm btn-primary">Ver más</a>
                                </div>
                            </div>
                        </article>
                    {/each}
                </div>
            </section>
        {/each}
    </div>
</section>
