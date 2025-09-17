import page from 'page'

// Intercept anchor clicks to use page.js navigation without full reload
export function goto(e: MouseEvent) {
  // If modified click or external, let the browser handle it
  if (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  )
    return

  const anchor = e.currentTarget as HTMLAnchorElement | null
  if (!anchor) return
  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('http') || href.startsWith('mailto:')) return

  e.preventDefault()
  page.show(href)
}
