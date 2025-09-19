<script lang="ts">
    import toast from '../../lib/toast';

    type FormData = { name: string; email: string; password: string; confirm: string };
    let form: FormData = { name: '', email: '', password: '', confirm: '' };
    let submitting = $state(false);

    function validate(): string | null {
        if (!form.name || form.name.trim().length < 2) return 'Ingresa tu nombre';
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Ingresa un correo válido';
        if (!form.password || form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        if (form.password !== form.confirm) return 'Las contraseñas no coinciden';
        return null;
    }

    async function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        const err = validate();
        if (err) {
            toast.error(err);
            return;
        }
        try {
            submitting = true;
            // TODO: Integrar API de registro
            await new Promise((r) => setTimeout(r, 700));
            toast.success('Registro exitoso, ahora puedes iniciar sesión');
            window.location.href = '/auth/login';
        } catch (e) {
            console.error(e);
            toast.error('No se pudo completar el registro');
        } finally {
            submitting = false;
        }
    }
</script>

<section class="max-w-md mx-auto w-full py-8">
    <h1 class="text-2xl font-bold mb-6">Crear cuenta</h1>
    <form on:submit={onSubmit} novalidate class="space-y-4">
        <div class="form-control">
            <label for="name" class="label">
                <span class="label-text">Nombre</span>
            </label>
            <input id="name" type="text" class="input input-bordered w-full" bind:value={form.name} required autocomplete="name" placeholder="Tu nombre" />
        </div>
        <div class="form-control">
            <label for="email" class="label">
                <span class="label-text">Correo electrónico</span>
            </label>
            <input id="email" type="email" class="input input-bordered w-full" bind:value={form.email} required autocomplete="email" placeholder="tucorreo@ejemplo.com" />
        </div>
        <div class="form-control">
            <label for="password" class="label">
                <span class="label-text">Contraseña</span>
            </label>
            <input id="password" type="password" class="input input-bordered w-full" bind:value={form.password} required minlength={6} autocomplete="new-password" placeholder="••••••••" />
        </div>
        <div class="form-control">
            <label for="confirm" class="label">
                <span class="label-text">Confirmar contraseña</span>
            </label>
            <input id="confirm" type="password" class="input input-bordered w-full" bind:value={form.confirm} required minlength={6} autocomplete="new-password" placeholder="••••••••" />
        </div>
        <button class="btn btn-primary w-full" type="submit" disabled={submitting}>
            {submitting ? 'Creando cuenta…' : 'Registrarme'}
        </button>
    </form>
    <p class="mt-4 text-sm">
        ¿Ya tienes cuenta?
        <a class="link" href="/auth/login">Inicia sesión</a>
    </p>
</section>
