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
          <a href="communications/">Communications</a>
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
  5: { label: 'Communications', path: '/communications/' }
}

class SiteNav extends HTMLElement {
  connectedCallback() {
    const segs = window.location.pathname.split('/').filter(Boolean)
    const firstKey = Object.keys(NAV_MAP).find(k => NAV_MAP[k].path === '/' + (segs[0] || '') + '/')
    const parent = segs.length <= 1 ? '/' : '/' + segs.slice(0, -1).join('/') + '/'
    const parentKey = Object.keys(NAV_MAP).find(k => NAV_MAP[k].path === parent)
    const pageName = segs.length === 1 && firstKey ? NAV_MAP[firstKey].label : (segs[segs.length - 1] || '')
    const pageCls = firstKey === '1' ? ' cred' : ''
    const trail = [`<a class="crt-item home" href="/"><span class="label">Jonty</span></a>`]
    let acc = ''
    segs.forEach((seg, i) => {
      acc += '/' + seg
      const cls = i === 0 && firstKey === '1' ? 'crt-item cred' : 'crt-item'
      const label = i === 0 && firstKey ? NAV_MAP[firstKey].label : seg
      trail.push(`<a class="${cls}" href="${acc}/"><span class="label">${label}</span></a>`)
    })
    const keys = Object.keys(NAV_MAP).map(k => {
      const c = (k === '0' ? ' home' : k === '1' ? ' cred' : '') + (k === firstKey ? ' selected' : '')
      return `<a class="crt-key${c}" href="${NAV_MAP[k].path}">${k}</a>`
    }).join('')
    this.innerHTML = `
      <nav class="crumb">
        <div class="crumb-inner">
          <div class="crumb-bar">
            <div class="crumb-trail">${trail.join('<span class="crumb-sep">/</span>')}</div>
            <div class="crumb-keys">${keys}</div>
          </div>
          <div class="crumb-hints">
            <a class="crt-hint show" href="/"><span class="key">[0]</span> home</a>
            <a class="crt-hint show" href="${parent}"><span class="key">[esc]</span> back</a>
          </div>
          <div class="crumb-mobile">
            <a class="crumb-back" href="${parent}">&larr;</a>
            <span class="crumb-page${pageCls}">${pageName}</span>
          </div>
        </div>
      </nav>
    `
    const preview = key => {
      if (!key) return
      let html = `<a class="crt-item home" href="/"><span class="label">Jonty</span></a>`
      if (key !== '0') {
        const cls = key === '1' ? 'crt-item cred' : 'crt-item'
        html += `<span class="crumb-sep">/</span><a class="${cls}" href="${NAV_MAP[key].path}"><span class="label">${NAV_MAP[key].label}</span></a>`
      }
      this.querySelector('.crumb-trail').innerHTML = html
      this.querySelectorAll('.crt-key').forEach(el => el.classList.toggle('selected', el.textContent === key))
    }

    const go = (key, path) => {
      preview(key)
      document.querySelectorAll('main, site-footer').forEach(el => el.style.visibility = 'hidden')
      requestAnimationFrame(() => requestAnimationFrame(() => { location.href = path }))
    }

    this.querySelectorAll('.crt-key').forEach(el => el.addEventListener('click', e => { e.preventDefault(); go(el.textContent, el.href) }))
    const hints = this.querySelectorAll('.crumb-hints a')
    hints[0].addEventListener('click', e => { e.preventDefault(); go('0', hints[0].href) })
    hints[1].addEventListener('click', e => { e.preventDefault(); go(parentKey, hints[1].href) })
    const back = this.querySelector('.crumb-back')
    back.addEventListener('click', e => { e.preventDefault(); go(parentKey, back.href) })

    window.addEventListener('keydown', e => {
      const k = e.key
      if (k === 'Escape') { e.preventDefault(); go(parentKey, parent) }
      else if (k === '0') { e.preventDefault(); go('0', NAV_MAP[0].path) }
      else if (k >= '1' && k <= '5') { e.preventDefault(); go(k, NAV_MAP[k].path) }
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

class ProjectGallery extends HTMLElement {
  async connectedCallback() {
    const probe = src => new Promise(res => {
      const i = new Image()
      i.onload = () => res(true)
      i.onerror = () => res(false)
      i.src = src
    })

    const images = []
    let n = 1
    while (true) {
      const png = 'gallery/' + n + '.png'
      const gif = 'gallery/' + n + '.gif'
      if (await probe(png)) images.push(png)
      else if (await probe(gif)) images.push(gif)
      else break
      n++
    }

    if (!images.length) {
      this.innerHTML = `<div class="gallery-empty">no images yet</div>`
      return
    }

    this.innerHTML = `
      <div class="carousel ready" id="carousel">
        <div class="carousel-track" id="carousel-track"></div>
        <button class="carousel-btn carousel-prev" id="prev" aria-label="previous">&#8249;</button>
        <button class="carousel-btn carousel-next" id="next" aria-label="next">&#8250;</button>
        <div class="carousel-dots" id="dots"></div>
      </div>
      <div class="lightbox" id="lightbox" role="dialog" aria-modal="true">
        <button class="lightbox-close" id="lb-close" aria-label="close">✕</button>
        <img id="lb-img" src="" alt="">
      </div>
    `

    const track = this.querySelector('#carousel-track')
    const dotsEl = this.querySelector('#dots')
    const prevBtn = this.querySelector('#prev')
    const nextBtn = this.querySelector('#next')
    const lb = this.querySelector('#lightbox')
    const lbImg = this.querySelector('#lb-img')
    const lbClose = this.querySelector('#lb-close')

    images.forEach((src, i) => {
      const img = document.createElement('img')
      img.src = src
      img.alt = 'screenshot ' + (i + 1)
      if (i === 0) img.classList.add('visible')
      track.appendChild(img)
    })

    images.forEach((_, i) => {
      const dot = document.createElement('div')
      dot.className = 'dot' + (i === 0 ? ' active' : '')
      dot.addEventListener('click', () => goTo(i))
      dotsEl.appendChild(dot)
    })

    const imgs = track.querySelectorAll('img')
    const dots = dotsEl.querySelectorAll('.dot')
    let current = 0

    function goTo(idx) {
      imgs[current].classList.remove('visible')
      dots[current].classList.remove('active')
      current = (idx + images.length) % images.length
      imgs[current].classList.add('visible')
      dots[current].classList.add('active')
    }

    prevBtn.addEventListener('click', () => goTo(current - 1))
    nextBtn.addEventListener('click', () => goTo(current + 1))

    document.addEventListener('keydown', e => {
      if (lb.classList.contains('open')) return
      if (e.key === 'ArrowLeft')  goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
    })

    track.addEventListener('click', () => {
      lbImg.src = images[current]
      lb.classList.add('open')
    })

    const closeLb = () => lb.classList.remove('open')
    lbClose.addEventListener('click', closeLb)
    lb.addEventListener('click', e => { if (e.target === lb) closeLb() })
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb() })
  }
}

class ProjectIcon extends HTMLElement {
  connectedCallback() {
    const name = window.location.pathname.split('/').filter(Boolean).pop()
    const img = new Image()
    img.onload = () => {
      img.className = 'card-icon'
      img.alt = ''
      this.appendChild(img)
    }
    img.src = name + '.png'
  }
}

customElements.define('home-nav', HomeNav)
customElements.define('site-nav', SiteNav)
customElements.define('site-footer', SiteFooter)
customElements.define('crt-overlay', CrtOverlay)
customElements.define('project-gallery', ProjectGallery)
customElements.define('project-icon', ProjectIcon)

;(function () {
  function setScan() {
    const dpr = window.devicePixelRatio || 1
    const scan = Math.max(3, Math.min(7, Math.round(3 * dpr)))
    document.documentElement.style.setProperty('--scan', scan + 'px')
  }
  setScan()
  window.addEventListener('resize', setScan)
})()