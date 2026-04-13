function format(n) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)
}

function getPlanetId() {
  const params = new URLSearchParams(location.search)
  return params.get('id')
}

const root = document.getElementById('planetPage')
const id = getPlanetId()
const p = window.COSMOS_DATA?.PLANETS_BY_ID?.[id]

if (!root) {
  // nothing
} else if (!p) {
  root.innerHTML = `
    <div class="planetPage__notFound">
      <h2 class="planetPage__h2">Planet not found</h2>
      <p class="muted">That page doesn’t exist.</p>
      <div style="margin-top: 12px;">
        <a class="btn" href="./index.html#planets">Back to Planets</a>
      </div>
    </div>
  `
} else {
  document.title = `${p.name} • Cosmosim`
  root.innerHTML = `
    <div class="planetPage__breadcrumbs">
      <a href="./index.html#home">Home</a>
      <span class="planetPage__sep">/</span>
      <span>${p.name}</span>
    </div>

    <div class="planetPage__top">
      <div class="planetPage__media">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div>
        <div class="kicker">Planet</div>
        <h1 class="planetPage__h1">${p.name}</h1>
        <p class="planetPage__blurb">${p.blurb}</p>
        <div class="planetPage__actions">
          <a class="btn" href="${p.nasaLink}" target="_blank" rel="noreferrer">
          NASA reference
          </a>
          <a class="btn" href="./index.html#planets">Back to cards</a>
        </div>
      </div>
    </div>

    <div class="planetPage__grid">
      <div class="planetPage__kv">
        <div class="muted">Mean orbital speed</div>
        <div class="planetPage__kvValue">${format(p.meanOrbitalSpeedKmS)} km/s</div>
      </div>
      <div class="planetPage__kv">
        <div class="muted">Orbital period</div>
        <div class="planetPage__kvValue">${format(p.orbitalPeriodDays)} days</div>
      </div>
      <div class="planetPage__kv">
        <div class="muted">Rotation period</div>
        <div class="planetPage__kvValue">${format(p.rotationPeriodHours)} hours</div>
      </div>
      <div class="planetPage__kv">
        <div class="muted">Distance from Sun (semi‑major axis)</div>
        <div class="planetPage__kvValue">${format(p.semimajorAxisAU)} AU</div>
      </div>
    </div>

    <div class="planetPage__note">
      This page uses a small curated dataset for the simulation (approximate values). For full, up-to-date details, use the NASA reference button above.
    </div>
  `
}

