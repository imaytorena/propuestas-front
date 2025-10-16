<script lang="ts">
    import toast from '../../lib/toast';
    import api from '../../utils/api';

    type FormData = { identificador: string; nombre: string; apellido: string; correo: string; password: string; confirm: string };
    let form: FormData = {identificador: '', nombre: '', apellido: '', correo: '', password: '', confirm: ''};
    let submitting = $state(false);
    let checkingUsername = $state(false);
    let usernameError = $state('');
    let usernameTimeout: number;

    async function checkUsername(username: string) {
        if (!username || username.length < 2) {
            usernameError = '';
            return;
        }
        
        try {
            checkingUsername = true;
            const { data } = await api.get(`usuarios/validate/identificador?identificador=${encodeURIComponent(username)}`);
            usernameError = data.available ? '' : 'Este username ya está en uso';
        } catch (e: any) {
            usernameError = 'Error verificando username';
        } finally {
            checkingUsername = false;
        }
    }

    function onUsernameChange() {
        clearTimeout(usernameTimeout);
        usernameError = '';
        if (form.identificador.trim().length >= 2) {
            usernameTimeout = setTimeout(() => checkUsername(form.identificador), 500);
        }
    }

    function validate(): string | null {
        if (!form.identificador || form.identificador.trim().length < 2) return 'Ingresa tu username';
        if (usernameError) return usernameError;
        if (!form.nombre || form.nombre.trim().length < 2) return 'Ingresa tu nombre';
        if (!form.apellido || form.apellido.trim().length < 2) return 'Ingresa tu apellido';
        if (!form.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) return 'Ingresa un correo válido';
        if (!form.password || form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
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
            await api.post('/auth/register', {
                identificador: form.identificador,
                nombre: form.nombre,
                apellido: form.apellido,
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
        <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
                <label for="nombre" class="label">
                    <span class="label-text">Nombre</span>
                </label>
                <input id="nombre" type="text" class="input input-bordered w-full" bind:value={form.nombre}
                       required autocomplete="given-name" placeholder="Tu nombre"/>
            </div>
            <div class="form-control">
                <label for="apellido" class="label">
                    <span class="label-text">Apellido</span>
                </label>
                <input id="apellido" type="text" class="input input-bordered w-full" bind:value={form.apellido}
                       required autocomplete="family-name" placeholder="Tu apellido"/>
            </div>
        </div>
        <div class="form-control">
            <label for="identificador" class="label">
                <span class="label-text">Username</span>
            </label>
            <div class="relative">
                <input id="identificador" type="text" 
                       class="input input-bordered w-full" 
                       class:input-error={usernameError}
                       class:input-success={form.identificador.length >= 2 && !usernameError && !checkingUsername}
                       bind:value={form.identificador}
                       oninput={onUsernameChange}
                       required autocomplete="username" placeholder="Tu username"/>
                {#if checkingUsername}
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                        <div class="loading loading-spinner loading-sm"></div>
                    </div>
                {/if}
            </div>
            {#if usernameError}
                <div class="label">
                    <span class="label-text-alt text-error">{usernameError}</span>
                </div>
            {:else if form.identificador.length >= 2 && !checkingUsername}
                <div class="label">
                    <span class="label-text-alt text-success">Username disponible</span>
                </div>
            {/if}
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
                   minlength={8} autocomplete="new-password" placeholder="••••••••"/>
        </div>
        <div class="form-control">
            <label for="confirm" class="label">
                <span class="label-text">Confirmar contraseña</span>
            </label>
            <input id="confirm" type="password" class="input input-bordered w-full" bind:value={form.confirm} required
                   minlength={8} autocomplete="new-password" placeholder="••••••••"/>
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
