class HomeNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <span class="nav-logo">JA<span class="cursor-blink">_</span></span>
        <div class="nav-links">
          <a href="credentials/">Credentials</a>
          <a href="projects/">Projects</a>
          <a href="writeups/">Writeups</a>
          <a href="log/">Log</a>
          <a href="communications/">Comms</a>
        </div>
      </nav>
    `
  }
}

const NAV_MAP = {
  0: { label: 'Home', path: '/' },
  1: { label: 'Credentials', path: '/credentials/' },
  2: { label: 'Projects', path: '/projects/' },
  3: { label: 'Writeups', path: '/writeups/' },
  4: { label: 'Log', path: '/log/' },
  5: { label: 'Comms', path: '/communications/' }
}

class SiteNav extends HTMLElement {
  connectedCallback() {
    const seg = window.location.pathname.split('/').filter(Boolean)[0] || ''
    const key = Object.keys(NAV_MAP).find(k => NAV_MAP[k].path === '/' + seg + '/')
    const page = NAV_MAP[key]
    const cred = key === '1' ? ' cred' : ''
    const keys = Object.keys(NAV_MAP).map(k => {
      const c = (k === '0' ? ' home' : k === '1' ? ' cred' : '') + (k === key ? ' selected' : '')
      return `<a class="crt-key${c}" href="${NAV_MAP[k].path}">${k}</a>`
    }).join('')
    this.innerHTML = `
      <nav class="crumb">
        <div class="crumb-inner">
          <div class="crumb-bar">
            <div class="crumb-trail">
              <a class="crt-item home" href="/"><span class="label">Jonty</span></a>
              <span class="crumb-sep">/</span>
              <a class="crt-item${cred}" href="${page.path}"><span class="label">${page.label}</span></a>
            </div>
            <div class="crumb-keys">${keys}</div>
          </div>
          <div class="crumb-hints">
            <span class="crt-hint show"><span class="key">[0]</span> home</span>
            <span class="crt-hint show"><span class="key">[esc]</span> back</span>
          </div>
        </div>
      </nav>
    `
    window.addEventListener('keydown', e => {
      const k = e.key
      if (k === '0' || k === 'Escape') { e.preventDefault(); location.href = NAV_MAP[0].path }
      else if (k >= '1' && k <= '5') { e.preventDefault(); location.href = NAV_MAP[k].path }
    })
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <span>Jonty Ali · Durham · 2026</span>
        <span>© 2026 Jonty Ali. All rights reserved.</span>
      </footer>
    `
  }
}

class CrtOverlay extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="crt-fx">
        <div class="static"></div>
        <div class="bloom"></div>
        <div class="scanlines"></div>
        ${this.hasAttribute('rollbar') ? '<div class="rollbar"></div>' : ''}
        <div class="vignette"></div>
        <div class="flicker"></div>
      </div>
    `
  }
}

customElements.define('home-nav', HomeNav)
customElements.define('site-nav', SiteNav)
customElements.define('site-footer', SiteFooter)
customElements.define('crt-overlay', CrtOverlay)

;(function () {
  function setScan() {
    const dpr = window.devicePixelRatio || 1
    const scan = Math.max(3, Math.min(7, Math.round(3 * dpr)))
    document.documentElement.style.setProperty('--scan', scan + 'px')
  }
  setScan()
  window.addEventListener('resize', setScan)
})()