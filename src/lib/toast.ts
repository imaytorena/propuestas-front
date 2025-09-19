import { toast as baseToast } from '@zerodevx/svelte-toast'

// Basic helpers to mirror svelte-french-toast API used in the app
function success(message: string, opts: any = {}) {
  return baseToast.push(message, { ...opts })
}

function error(message: string, opts: any = {}) {
  return baseToast.push(message, { ...opts })
}

async function promise<T>(p: Promise<T> | (() => Promise<T>), msgs: { loading: string; success: string | ((val: T) => string); error: string | ((err: any) => string) }) {
  const run = typeof p === 'function' ? (p as () => Promise<T>)() : (p as Promise<T>)
  const id = baseToast.push(msgs.loading, { duration: 60_000 })
  try {
    const val = await run
    // Dismiss loading toast then show success
    // @ts-ignore pop is available in svelte-toast runtime
    if (typeof (baseToast as any).pop === 'function') {
      ;(baseToast as any).pop(id)
    }
    const text = typeof msgs.success === 'function' ? (msgs.success as any)(val) : msgs.success
    baseToast.push(text)
    return val
  } catch (e) {
    // @ts-ignore pop is available in svelte-toast runtime
    if (typeof (baseToast as any).pop === 'function') {
      ;(baseToast as any).pop(id)
    }
    const text = typeof msgs.error === 'function' ? (msgs.error as any)(e) : msgs.error
    baseToast.push(text)
    throw e
  }
}

// Export a default `toast` object compatible with current usage
const toast: any = baseToast as any
;
(toast as any).success = success
;(toast as any).error = error
;(toast as any).promise = promise

export { toast }
export default toast
