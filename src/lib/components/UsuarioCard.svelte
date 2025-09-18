<script lang="ts">
	export let usuario: {
		id: string;
		nombre: string;
		email: string;
	};
</script>



<div class="card bg-base-100 shadow-xl">
	<figure>
		<img
			src="https://thumbs.dreamstime.com/b/l%C3%ADnea-icono-del-negro-avatar-perfil-de-usuario-121102131.jpg"
			alt="Shoes" />
	</figure>
	<div class="card-body">
		<h2 class="card-title">
			{usuario.nombre}
			<div class="badge badge-secondary">{usuario.email}</div>
		</h2>
		<p>If a dog chews shoes whose shoes does he choose?</p>
		<div class="card-actions justify-end">
			<div class="badge badge-outline">Fashion</div>
			<div class="badge badge-outline">Products</div>
		</div>
	</div>
</div>