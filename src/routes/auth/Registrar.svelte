<script lang="ts">
    import toast from '../../lib/toast';
    import api from '../../utils/api';

    type FormData = { identificador: string; correo: string; password: string; confirm: string };
    let form: FormData = {identificador: '', correo: '', password: '', confirm: ''};
    let submitting = $state(false);

    function validate(): string | null {
        if (!form.identificador || form.identificador.trim().length < 2) return 'Ingresa tu nombre';
        if (!form.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) return 'Ingresa un correo válido';
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
            await api.post('/register', {
                identificador: form.identificador,
                correo: form.correo,
                password: form.password,
                password_confirmation: form.confirm,
            });
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
    <form onsubmit={onSubmit} novalidate class="space-y-4">
        <div class="form-control">
            <label for="identificador" class="label">
                <span class="label-text">Nombre</span>
            </label>
            <input id="identificador" type="text" class="input input-bordered w-full" bind:value={form.identificador}
                   required autocomplete="name" placeholder="Tu nombre"/>
        </div>
        <div class="form-control">
            <label for="correo" class="label">
                <span class="label-text">Correo electrónico</span>
            </label>
            <input id="correo" type="correo" class="input input-bordered w-full" bind:value={form.correo} required
                   placeholder="tucorreo@ejemplo.com"/>
        </div>
        <div class="form-control">
            <label for="password" class="label">
                <span class="label-text">Contraseña</span>
            </label>
            <input id="password" type="password" class="input input-bordered w-full" bind:value={form.password} required
                   minlength={6} autocomplete="new-password" placeholder="••••••••"/>
        </div>
        <div class="form-control">
            <label for="confirm" class="label">
                <span class="label-text">Confirmar contraseña</span>
            </label>
            <input id="confirm" type="password" class="input input-bordered w-full" bind:value={form.confirm} required
                   minlength={6} autocomplete="new-password" placeholder="••••••••"/>
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
