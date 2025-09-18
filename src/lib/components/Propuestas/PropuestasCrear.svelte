<!--<script lang="ts">-->
<!--	import { enhance } from '$app/forms';-->
<!--	import { goto } from '$app/navigation';-->
<!--	import MultiSelect from 'svelte-multiselect';-->

<!--	let { usuario } = $props();-->
<!--	let loading = $state(false);-->

<!--	$effect(() => {-->
<!--		loading = false;-->
<!--	});-->

<!--	const onSubmit = async (e: SubmitEvent) => {-->
<!--		e.preventDefault();-->
<!--		try {-->
<!--			loading = true;-->
<!--			goto('/propuestas');-->
<!--		} catch (error) {-->
<!--			console.error(error);-->
<!--			loading = false;-->
<!--		}-->
<!--	};-->

<!--	const categorias = [`Presencial`, `Fin de semana`, `Ambiente`, `UdeG`, `Alumnos`, `...`];-->

<!--	let selected = $state([]);-->
<!--</script>-->

<!--<form method="POST" onsubmit={onSubmit} class="card mb-4 w-full bg-base-100 shadow-xl" use:enhance>-->
<!--	<div class="card-body flex flex-col gap-4">-->
<!--		<h2 class="card-title">Nueva Propuesta</h2>-->
<!--		<div class="form-control">-->
<!--			<label class="label font-bold" for="nombre">-->
<!--				<span class="label-text">Nombre</span>-->
<!--			</label>-->
<!--			<input type="text" name="nombre" id="nombre" class="input input-bordered" required />-->
<!--		</div>-->
<!--		<div class="form-control">-->
<!--			<label class="label font-bold" for="descripcion">-->
<!--				<span class="label-text">Descripción</span>-->
<!--			</label>-->
<!--			&lt;!&ndash; svelte-ignore element_invalid_self_closing_tag &ndash;&gt;-->
<!--			<textarea-->
<!--				name="descripcion"-->
<!--				id="descripcion"-->
<!--				class="textarea textarea-bordered"-->
<!--				rows="4"-->
<!--				required-->
<!--			/>-->
<!--		</div>-->
<!--		&lt;!&ndash; fecha de entrega &ndash;&gt;-->
<!--		<div class="form-control">-->
<!--			<label class="label font-bold" for="fecha_entrega">-->
<!--				<span class="label-text">Fecha de Entrega</span>-->
<!--			</label>-->
<!--			<input type="date" name="fecha_entrega" value={new Date().toISOString().split('T')[0]} id="fecha_entrega" class="input input-bordered" />-->
<!--		</div>-->
<!--		&lt;!&ndash; imagen &ndash;&gt;-->
<!--		&lt;!&ndash; <div class="form-control">-->
<!--			<label class="label font-bold" for="imagen">-->
<!--				<span class="label-text">Imagen</span>-->
<!--			</label>-->
<!--			<input type="file" name="imagen" id="imagen" class="file-input file-input-bordered w-full" />-->
<!--		</div> &ndash;&gt;-->
<!--		<div class="form-control">-->
<!--			<label class="label font-bold" for="categorias">-->
<!--				<span class="label-text">Categorias (maximo 10)</span>-->
<!--			</label>-->
<!--			<MultiSelect-->
<!--				outerDivClass="input input-bordered w-full"-->
<!--				name="categorias"-->
<!--				bind:selected-->
<!--				options={categorias}-->
<!--				allowUserOptions-->
<!--				maxSelect={10}-->
<!--				createOptionMsg="Crear nueva categoria"-->
<!--			/>-->
<!--		</div>-->

<!--		<div class="mt-4 flex items-center justify-between">-->
<!--			<div>-->
<!--				<b>Usuario:</b>-->
<!--				{usuario.username}-->
<!--			</div>-->

<!--			{#if loading}-->
<!--				Cargando...-->
<!--			{:else}-->
<!--				<div>-->
<!--					<button-->
<!--						onclick={() => {-->
<!--							goto('/propuestas');-->
<!--						}}-->
<!--						class="btn-gray btn text-gray-700">Cancelar</button-->
<!--					>-->
<!--					<button type="submit" class="btn btn-primary text-white">Crear propuesta</button>-->
<!--				</div>-->
<!--			{/if}-->
<!--		</div>-->
<!--	</div>-->
<!--</form>-->
