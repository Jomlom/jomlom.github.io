// shared logic for all project pages

const probe = src => new Promise(res => {
  const i = new Image()
  i.onload = () => res(true)
  i.onerror = () => res(false)
  i.src = src
})

;(async () => {
  const images = []
  let n = 1
  while (true) {
    const png = 'gallery/' + n + '.png'
    const gif = 'gallery/' + n + '.gif'
    if (await probe(png)) {
      images.push(png)
    } else if (await probe(gif)) {
      images.push(gif)
    } else {
      break
    }
    n++
  }

  if (!images.length) {
    document.getElementById('gallery-placeholder').style.display = 'block'
    return
  }

  const carousel = document.getElementById('carousel')
  const track = document.getElementById('carousel-track')
  const dotsEl = document.getElementById('dots')
  const prevBtn = document.getElementById('prev')
  const nextBtn = document.getElementById('next')

  carousel.classList.add('ready')

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
})()

// lightbox
const lb = document.getElementById('lightbox')
const lbImg = document.getElementById('lb-img')
const lbClose = document.getElementById('lb-close')

const closeLb = () => lb.classList.remove('open')
lbClose.addEventListener('click', closeLb)
lb.addEventListener('click', e => { if (e.target === lb) closeLb() })
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb() })