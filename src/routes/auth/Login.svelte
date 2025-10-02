<script lang="ts">
    import { route } from '../../router';
    import toast from '../../lib/toast';
    import api from '../../utils/api';
    import { setSession } from '../../stores/auth';

    type FormData = { email: string; password: string };
    let form: FormData = { email: '', password: '' };
    let submitting = $state(false);

    function validate(): string | null {
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Ingresa un correo válido';
        if (!form.password || form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return null;
    }

    function getReturnTo(): string | null {
        try {
            const params = new URLSearchParams(window.location.search)
            return params.get('returnTo')
        } catch {
            return null
        }
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
            const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
            const access_token = (data as any)?.access_token
            const user = (data as any)?.user
            if (!access_token) throw new Error('Credenciales inválidas')
            setSession(access_token, user)
            toast.success('Sesión iniciada');
            const returnTo = getReturnTo()
            window.location.href = returnTo || '/';
        } catch (e) {
            console.error(e);
            toast.error('No se pudo iniciar sesión');
        } finally {
            submitting = false;
        }
    }
</script>

<section class="max-w-md mx-auto w-full py-8">
    <h1 class="text-2xl font-bold mb-6">Iniciar sesión</h1>
    <form onsubmit={onSubmit} novalidate class="space-y-4">
        <div class="form-control">
            <label for="email" class="label">
                <span class="label-text">Correo electrónico</span>
            </label>
            <input
                id="email"
                type="email"
                class="input input-bordered w-full"
                bind:value={form.email}
                required
                autocomplete="email"
                placeholder="tucorreo@ejemplo.com"
            />
        </div>
        <div class="form-control">
            <label for="password" class="label">
                <span class="label-text">Contraseña</span>
            </label>
            <input
                id="password"
                type="password"
                class="input input-bordered w-full"
                bind:value={form.password}
                required
                minlength={6}
                autocomplete="current-password"
                placeholder="••••••••"
            />
        </div>
        <button class="btn btn-primary w-full" type="submit" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
    </form>
    <p class="mt-4 text-sm">
        ¿No tienes cuenta?
        <a class="link" href="/auth/registrar">Regístrate</a>
    </p>
</section>
