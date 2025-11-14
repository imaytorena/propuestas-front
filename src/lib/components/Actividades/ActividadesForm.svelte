<script lang="ts">
    // Cada actividad ahorario incluye fecha (obligatoria) y horario (opcional)
    export let actividades: Array<{ id?: number, nombre: string, descripcion: string, fecha: string, horario?: string }> = []
    export let onActividadEliminada: ((id: number) => void) | undefined = undefined

    const today = new Date().toISOString().split('T')[0]

    function agregarActividad() {
        actividades = [...actividades, {nombre: '', descripcion: '', fecha: '', horario: ''}]
    }

    function eliminarActividad(index: number) {
        const actividad = actividades[index]
        if (actividad?.id && onActividadEliminada) {
            onActividadEliminada(actividad.id)
        }
        actividades = actividades.filter((_, i) => i !== index)
    }
</script>

<div class="form-control">
    <div class="flex items-center justify-between mb-3">
        <label class="label">
            <span class="label-text font-medium">Actividades <span class="text-error">*</span></span>
        </label>
        <button
                type="button"
                class="btn btn-sm btn-outline btn-primary"
                onclick={agregarActividad}
        >
            + Agregar actividad
        </button>
    </div>

    {#if actividades.length === 0}
        <div class="text-sm text-gray-500 italic py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
            No hay actividades agregadas. Haz clic en "Agregar actividad" para comenzar.
        </div>
    {/if}

    <div class="space-y-4">
        {#each actividades as actividad, index}
            <div class="card bg-base-50 border border-gray-200">
                <div class="card-body p-4">
                    <div class="flex items-start justify-between mb-3">
                        <h4 class="font-medium text-sm text-gray-700">Actividad {index + 1}</h4>
                        <button
                                type="button"
                                class="btn btn-ghost btn-xs text-error hover:bg-error hover:text-white"
                                onclick={() => eliminarActividad(index)}
                                aria-label="Eliminar actividad {index + 1}"
                        >
                            ✕
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div class="form-control">
                            <label class="label" for="actividad-nombre-{index}">
                                <span class="label-text text-sm">Nombre</span>
                            </label>
                            <input
                                    id="actividad-nombre-{index}"
                                    class="input input-bordered input-sm w-full"
                                    type="text"
                                    bind:value={actividad.nombre}
                                    placeholder="Nombre de la actividad"
                                    required
                            />
                        </div>

                        <div class="form-control">
                            <label class="label" for="actividad-descripcion-{index}">
                                <span class="label-text text-sm">Descripción</span>
                            </label>
                            <textarea
                                    id="actividad-descripcion-{index}"
                                    class="textarea textarea-bordered textarea-sm w-full"
                                    rows="3"
                                    bind:value={actividad.descripcion}
                                    placeholder="Describe la actividad"
                                    required
                            ></textarea>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div class="form-control">
                                <label class="label" for="actividad-fecha-{index}">
                                    <span class="label-text text-sm">Fecha <span class="text-error">*</span></span>
                                </label>
                                <input
                                        id="actividad-fecha-{index}"
                                        class="input input-bordered input-sm w-full"
                                        type="date"
                                        bind:value={actividad.fecha}
                                        min={today}
                                        required
                                />
                            </div>
                            <div class="form-control">
                                <label class="label" for="actividad-horario-{index}">
                                    <span class="label-text text-sm">Hora (opcional)</span>
                                </label>
                                <input
                                        id="actividad-horario-{index}"
                                        class="input input-bordered input-sm w-full"
                                        type="time"
                                        bind:value={actividad.horario}
                                        min="07:00"
                                        max="22:00"
                                />
                                <div class="label">
                                    <span class="label-text-alt">Sugerido entre 7:00 y 22:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>