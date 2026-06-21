// site-nav web component
class SiteNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <a href="/" class="nav-logo">JA<span class="cursor-blink">_</span></a>
        <div class="nav-links">
          <a href="/projects/">Projects</a>
          <a href="/background/">Background</a>
          <a href="/log/">Log</a>
          <a href="/#contact">Contact</a>
        </div>
      </nav>
    `
  }
}

// site-footer web component
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <span>Jonty Ali · Durham · 2026</span>
      </footer>
    `
  }
}

customElements.define('site-nav', SiteNav)
customElements.define('site-footer', SiteFooter)
