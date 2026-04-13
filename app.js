(() => {
  const { PLANETS, MOONS } = window.COSMOS_DATA

  const $ = (sel) => document.querySelector(sel)
  const orbitsRoot = $('#orbitsRoot')
  const planetGrid = $('#planetGrid')
  const moonsGrid = $('#moonsGrid')
  const tooltip = $('#tooltip')
  const drawer = $('#drawer')
  const sidePanelBody = $('#sidePanelBody')

  const speedRange = $('#speedRange')
  const speedLabel = $('#speedLabel')
  const pauseBtn = $('#pauseBtn')
  const fullscreenBtn = $('#fullscreenBtn')
  const simShell = $('#simShell')
  const simWrap = $('#simWrap')
  const simDaysLabel = $('#simDaysLabel')
  const hoverSpeedLine = $('#hoverSpeedLine')

  const searchInput = $('#searchInput')
  const searchClear = $('#searchClear')
  const searchResults = $('#searchResults')

  // Mobile menu
  const menuBtn = $('.menuBtn')
  const nav = $('.nav')
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = !nav.classList.contains('isOpen')
      nav.classList.toggle('isOpen', open)
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
    nav.addEventListener('click', (e) => {
      const a = e.target.closest('a')
      if (!a) return
      nav.classList.remove('isOpen')
      menuBtn.setAttribute('aria-expanded', 'false')
    })
  }

  // Smooth scroll after hash changes
  const scrollToHash = () => {
    const id = (location.hash || '').replace('#', '')
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  window.addEventListener('hashchange', () => requestAnimationFrame(scrollToHash))

  // Build planet cards
  if (planetGrid) {
    planetGrid.innerHTML = PLANETS.map(
      (p) => `
      <a class="planetCard" href="./planet.html?id=${encodeURIComponent(p.id)}">
        <div class="planetCard__img"><img src="${p.image}" alt="${p.name}"></div>
        <div class="planetCard__body">
          <div class="planetCard__title">${p.name}</div>
          <div class="muted">${p.blurb}</div>
        </div>
      </a>
    `,
    ).join('')
  }

  // Build moons cards
  if (moonsGrid) {
    moonsGrid.innerHTML = MOONS.map(
      (m) => `
      <div class="moonCard">
        <div class="moonCard__top">
          <div class="moonCard__title">${m.name}</div>
          <div class="pill">orbits ${m.primary}</div>
        </div>
        <div class="muted">${m.blurb}</div>
      </div>
    `,
    ).join('')
  }

  // Simulation
  let daysPerSecond = Number(speedRange?.value ?? 30)
  let paused = false
  let fullscreen = false
  let simDays = 0
  let hoveredId = null
  let selectedId = null
  let raf = 0
  let last = performance.now()

  // Keep orbits visually circular and always within the frame.
  const orbitTilt = 1
  const maxAU = Math.max(...PLANETS.map((p) => p.semimajorAxisAU))

  const nf2 = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })

  let minOrbit = 80
  let maxOrbit = 320

  function computeOrbitBounds() {
    if (!simWrap) return
    const rect = simWrap.getBoundingClientRect()
    const r = Math.max(220, Math.min(rect.width, rect.height) / 2 - 70)
    minOrbit = 90
    maxOrbit = r
    for (const n of orbitNodes.values()) {
      n.orbitPx = orbitPxFor(n.p)
      n.orbitEl.style.width = `${n.orbitPx * 2}px`
      n.orbitEl.style.height = `${n.orbitPx * 2}px`
    }
  }

 function orbitPxFor(p) {
  const minAU = Math.min(...PLANETS.map(pl => pl.semimajorAxisAU))

  const logMin = Math.log(minAU)
  const logMax = Math.log(maxAU)
  const logVal = Math.log(p.semimajorAxisAU)

  const t = (logVal - logMin) / (logMax - logMin)

  return minOrbit + t * (maxOrbit - minOrbit)
}

  function setFullscreen(v) {
    fullscreen = v
    simShell?.classList.toggle('isFullscreen', fullscreen)
    fullscreenBtn.textContent = fullscreen ? 'Exit full screen' : 'Full screen'
    // Recompute bounds after layout changes.
    setTimeout(computeOrbitBounds, 0)
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n))
  }

  function getPlanetById(id) {
    return PLANETS.find((p) => p.id === id) || null
  }

  // Render orbit DOM once
  const orbitNodes = new Map()
  function ensureOrbits() {
    if (!orbitsRoot) return
    if (orbitNodes.size) return

    for (const p of PLANETS) {
      const orbitPx = orbitPxFor(p)
      const orbitEl = document.createElement('div')
      orbitEl.className = 'orbit'
      orbitEl.style.width = `${orbitPx * 2}px`
      orbitEl.style.height = `${orbitPx * 2}px`

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'planetBtn'
      btn.setAttribute('aria-label', p.name)

      const img = document.createElement('img')
      img.src = p.image
      img.alt = ''
      img.draggable = false
      img.style.width = `${p.radiusPx * 2}px`
      img.style.height = `${p.radiusPx * 2}px`

      const glow = document.createElement('span')
      glow.className = 'planetGlow'
      glow.setAttribute('aria-hidden', 'true')

      const label = document.createElement('div')
      label.className = 'planetLabel'
      label.hidden = true
      label.innerHTML = `${p.name}<span class="planetLabel__sub">${nf2.format(p.meanOrbitalSpeedKmS)} km/s</span>`

      btn.appendChild(img)
      btn.appendChild(glow)
      orbitEl.appendChild(btn)
      orbitEl.appendChild(label)
      orbitsRoot.appendChild(orbitEl)

      const state = { p, orbitPx, orbitEl, btn, img, label, x: 0, y: 0 }
      orbitNodes.set(p.id, state)

      btn.addEventListener('mouseenter', () => {
  hoveredId = p.id
  btn.style.zIndex = 20   // bring to front
  updateSidePanel()
})

btn.addEventListener('mouseleave', () => {
  hoveredId = hoveredId === p.id ? null : hoveredId
  btn.style.zIndex = 10   // reset
  hideTooltip()
  updateSidePanel()
})
      btn.addEventListener('mousemove', (e) => showTooltip(e, p))
      btn.addEventListener('click', () => {
        selectedId = selectedId === p.id ? null : p.id
        updateSelectionUI()
        updateSidePanel()
        updateDrawer()
      })
      btn.addEventListener('focus', () => {
        hoveredId = p.id
        updateSidePanel()
      })
      btn.addEventListener('blur', () => {
        hoveredId = hoveredId === p.id ? null : hoveredId
        hideTooltip()
        updateSidePanel()
      })
    }
  }

  function updateSelectionUI() {
    for (const [id, n] of orbitNodes) {
      const active = id === hoveredId || id === selectedId
      n.orbitEl.classList.toggle('isActive', active)
      n.btn.classList.toggle('isSelected', id === selectedId)
      n.label.hidden = !active
      if (active) {
        // Position label near the planet (not at orbit center)
        n.label.style.transform = `translate(calc(50% + ${n.x}px), calc(50% + ${n.y}px)) translate(-50%, calc(-100% - 12px))`
      }
    }
  }

  function updateSidePanel() {
    if (!sidePanelBody) return
    const p = getPlanetById(selectedId || hoveredId)
    if (!p) {
      hoverSpeedLine.textContent = 'Hover a planet to see its speed'
      sidePanelBody.className = 'muted'
      sidePanelBody.textContent = 'Hover a planet for quick info, or click to pin it here.'
      return
    }
    hoverSpeedLine.innerHTML = `<b>${p.name}</b> speed: ${nf2.format(p.meanOrbitalSpeedKmS)} km/s`
    sidePanelBody.className = ''
    sidePanelBody.innerHTML = `
      <div style="display:grid; gap:12px;">
        <div style="display:grid; grid-template-columns:70px 1fr; gap:12px; align-items:center;">
          <img src="${p.image}" alt="${p.name}" style="width:70px;height:70px;object-fit:contain;filter:drop-shadow(0 10px 18px rgba(0,0,0,0.5));">
          <div>
            <div style="font-size:18px;font-weight:900;margin-bottom:4px;">${p.name}</div>
            <div class="muted">${p.blurb}</div>
          </div>
        </div>
        <div style="display:grid; gap:10px;">
          <div style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed rgba(255,255,255,0.14);padding-bottom:8px;">
            <span class="muted">Speed</span><b>${nf2.format(p.meanOrbitalSpeedKmS)} km/s</b>
          </div>
          <div style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed rgba(255,255,255,0.14);padding-bottom:8px;">
            <span class="muted">Orbit</span><b>${nf2.format(p.orbitalPeriodDays)} days</b>
          </div>
          <div style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed rgba(255,255,255,0.14);padding-bottom:8px;">
            <span class="muted">Rotation</span><b>${nf2.format(p.rotationPeriodHours)} h</b>
          </div>
        </div>
        <div style="display:grid; gap:10px;">
          <a class="btn" href="./planet.html?id=${encodeURIComponent(p.id)}">Open full page</a>
          ${selectedId ? `<button class="btn" id="clearSelectionBtn" type="button">Clear selection</button>` : ''}
        </div>
      </div>
    `
    const clearBtn = document.getElementById('clearSelectionBtn')
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedId = null
        updateSelectionUI()
        updateSidePanel()
        updateDrawer()
      })
    }
  }

  function updateDrawer() {
    if (!drawer) return
    const p = getPlanetById(selectedId)
    if (!p) {
      drawer.hidden = true
      drawer.innerHTML = ''
      return
    }
    drawer.hidden = false
    drawer.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;">
        <div style="font-size:22px;font-weight:900;">${p.name}</div>
        <button class="btn" id="drawerClose" type="button">Close</button>
      </div>
      <div style="display:grid;grid-template-columns:220px 1fr;gap:14px;align-items:center;">
        <div style="height:180px;display:grid;place-items:center;background:rgba(0,0,0,0.25);border-radius:16px;border:1px solid rgba(255,255,255,0.12);">
          <img src="${p.image}" alt="${p.name}" style="max-width:85%;max-height:85%;object-fit:contain;filter:drop-shadow(0 10px 18px rgba(0,0,0,0.5));">
        </div>
        <div>
          <div style="font-size:15px;margin-bottom:10px;color:rgba(240,240,240,0.9);">${p.blurb}</div>
          <ul style="list-style:none;padding:0;margin:0 0 12px;display:grid;gap:10px;">
            <li style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed rgba(255,255,255,0.14);padding-bottom:8px;">
              <span class="muted">Mean orbital speed</span><b>${nf2.format(p.meanOrbitalSpeedKmS)} km/s</b>
            </li>
            <li style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed rgba(255,255,255,0.14);padding-bottom:8px;">
              <span class="muted">Orbital period</span><b>${nf2.format(p.orbitalPeriodDays)} days</b>
            </li>
            <li style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed rgba(255,255,255,0.14);padding-bottom:8px;">
              <span class="muted">Rotation period</span><b>${nf2.format(p.rotationPeriodHours)} hours</b>
            </li>
          </ul>
          <a class="btn" href="./planet.html?id=${encodeURIComponent(p.id)}">Read more</a>
        </div>
      </div>
    `
    const close = document.getElementById('drawerClose')
    if (close) {
      close.addEventListener('click', () => {
        selectedId = null
        updateSelectionUI()
        updateSidePanel()
        updateDrawer()
      })
    }
  }

  function showTooltip(e, p) {
    if (!tooltip || !simWrap) return
    const rect = simWrap.getBoundingClientRect()
    tooltip.hidden = false
    const x = clamp(e.clientX - rect.left + 14, 12, rect.width - 240)
    const y = clamp(e.clientY - rect.top + 14, 12, rect.height - 140)
    tooltip.style.left = `${x}px`
    tooltip.style.top = `${y}px`
    tooltip.innerHTML = `
      <div class="sim__tooltipTitle">${p.name}</div>
      <div class="muted">${p.blurb}</div>
      <div class="sim__tooltipRow">Orbit period: <b>${nf2.format(p.orbitalPeriodDays)}</b> days</div>
      <div class="sim__tooltipRow">Speed: <b>${nf2.format(p.meanOrbitalSpeedKmS)}</b> km/s</div>
      <div class="sim__tooltipRow"><a class="sim__tooltipLink" href="./planet.html?id=${encodeURIComponent(p.id)}">Open full info →</a></div>
    `
  }

  function hideTooltip() {
    if (!tooltip) return
    tooltip.hidden = true
    tooltip.innerHTML = ''
  }

  function step(now) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!paused) simDays += dt * daysPerSecond

    simDaysLabel.textContent = nf2.format(simDays)
    updateSelectionUI()

    for (const n of orbitNodes.values()) {
      const { p, orbitPx, btn, img } = n
      const angle = (simDays / p.orbitalPeriodDays) * Math.PI * 2
     const x = Math.cos(angle) * orbitPx
     const y = Math.sin(angle) * orbitPx * 0.8
btn.style.left = "50%"
btn.style.top = "50%"

btn.style.transform = `
  translate(-50%, -50%)
  translate(${x}px, ${y}px)
`
      n.x = x
      n.y = y

      const spin = (simDays * 24) / Math.abs(p.rotationPeriodHours) * 360 * (p.rotationPeriodHours < 0 ? -1 : 1)
      img.style.transform = `rotate(${spin}deg)`
    }

    raf = requestAnimationFrame(step)
  }

  if (speedRange) {
    speedLabel.textContent = String(daysPerSecond)
    speedRange.addEventListener('input', () => {
      daysPerSecond = Number(speedRange.value)
      speedLabel.textContent = String(daysPerSecond)
    })
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      paused = !paused
      pauseBtn.textContent = paused ? 'Resume' : 'Pause'
    })
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => setFullscreen(!fullscreen))
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setFullscreen(false)
    })
  }

  // Search
  function renderResults(rows) {
    if (!searchResults) return
    if (!rows.length) {
      searchResults.hidden = true
      searchResults.innerHTML = ''
      return
    }
    searchResults.hidden = false
    searchResults.innerHTML = rows
      .map(
        (r) => `
        <button class="sim__resultRow" type="button" data-type="${r.type}" data-id="${r.id}">
          <span class="sim__resultTitle">${r.title}</span>
          <span class="sim__resultSub">${r.subtitle}</span>
        </button>
      `,
      )
      .join('')
  }

  if (searchInput && searchClear && searchResults) {
    const update = () => {
      const q = searchInput.value.trim().toLowerCase()
      searchClear.hidden = !q
      if (!q) return renderResults([])
      const planets = PLANETS.filter((p) => p.name.toLowerCase().includes(q)).map((p) => ({
        type: 'planet',
        id: p.id,
        title: p.name,
        subtitle: 'Planet',
      }))
      const moons = MOONS.filter((m) => m.name.toLowerCase().includes(q) || m.primary.toLowerCase().includes(q)).map(
        (m) => ({
          type: 'moon',
          id: m.id,
          title: m.name,
          subtitle: `Moon of ${m.primary}`,
        }),
      )
      renderResults([...planets, ...moons].slice(0, 8))
    }

    searchInput.addEventListener('input', update)
    searchClear.addEventListener('click', () => {
      searchInput.value = ''
      update()
      searchInput.focus()
    })
    searchResults.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]')
      if (!btn) return
      const type = btn.getAttribute('data-type')
      const id = btn.getAttribute('data-id')
      if (type === 'planet') {
        selectedId = id
        updateSelectionUI()
        updateSidePanel()
        updateDrawer()
      }
      searchInput.value = ''
      update()
    })
    document.addEventListener('click', (e) => {
      if (searchResults.hidden) return
      const inside = e.target.closest('.sim__searchBar')
      if (!inside) renderResults([])
    })
  }

  ensureOrbits()
  // Fit orbits to the current frame size.
  computeOrbitBounds()
  window.addEventListener('resize', () => computeOrbitBounds())
  updateSelectionUI()
  updateSidePanel()
  updateDrawer()
  raf = requestAnimationFrame(step)
})()

