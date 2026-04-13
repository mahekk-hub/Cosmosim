// Shared data for the static (non-React) version.
// Values are approximate and intended for a smooth educational simulation.

window.COSMOS_DATA = (() => {
  const PLANETS = [
    {
      id: 'mercury',
      name: 'Mercury',
      image: './Screenshot 2026-02-14 003559.png',
      orbitalPeriodDays: 87.969,
      semimajorAxisAU: 0.387,
      meanOrbitalSpeedKmS: 47.36,
      rotationPeriodHours: 1407.6,
      radiusPx: 14,
      blurb: 'Smallest planet and closest to the Sun.',
      nasaLink: 'https://science.nasa.gov/mercury/'
    },
    {
      id: 'venus',
      name: 'Venus',
      image: './Screenshot 2026-02-14 002220.png',
      orbitalPeriodDays: 224.701,
      semimajorAxisAU: 0.723,
      meanOrbitalSpeedKmS: 35.02,
      rotationPeriodHours: -5832.5,
      radiusPx: 20,
      blurb: 'A hot world with a thick atmosphere and retrograde rotation.',
      nasaLink: 'https://science.nasa.gov/venus/'
    },
    {
      id: 'earth',
      name: 'Earth',
      image: './Screenshot 2026-02-14 002617.png',
      orbitalPeriodDays: 365.256,
      semimajorAxisAU: 1.0,
      meanOrbitalSpeedKmS: 29.78,
      rotationPeriodHours: 23.934,
      radiusPx: 22,
      blurb: 'Our home planet — the only known world with life.',
      nasaLink: 'https://science.nasa.gov/earth/'
    },
    {
      id: 'mars',
      name: 'Mars',
      image: './Screenshot 2026-02-13 235339.png',
      orbitalPeriodDays: 686.98,
      semimajorAxisAU: 1.524,
      meanOrbitalSpeedKmS: 24.07,
      rotationPeriodHours: 24.623,
      radiusPx: 18,
      blurb: 'A cold desert world with the tallest volcano in the Solar System.',
      nasaLink: 'https://science.nasa.gov/mars/'
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      image: './Screenshot 2026-02-14 004123.png',
      orbitalPeriodDays: 4332.59,
      semimajorAxisAU: 5.203,
      meanOrbitalSpeedKmS: 13.07,
      rotationPeriodHours: 9.925,
      radiusPx: 26,
      blurb: 'The largest planet — a gas giant with powerful storms.',
      nasaLink: 'https://science.nasa.gov/jupiter/'
    },
    {
      id: 'saturn',
      name: 'Saturn',
      image: './Screenshot 2026-02-14 005520.png',
      orbitalPeriodDays: 10759.22,
      semimajorAxisAU: 9.537,
      meanOrbitalSpeedKmS: 9.69,
      rotationPeriodHours: 10.656,
      radiusPx: 24,
      blurb: 'Famous for its bright rings and many moons.',
      nasaLink: 'https://science.nasa.gov/saturn/'
    },
    {
      id: 'uranus',
      name: 'Uranus',
      image: './Screenshot 2026-02-14 010041.png',
      orbitalPeriodDays: 30688.5,
      semimajorAxisAU: 19.191,
      meanOrbitalSpeedKmS: 6.81,
      rotationPeriodHours: -17.24,
      radiusPx: 22,
      blurb: 'An ice giant that rotates on its side.',
      nasaLink: 'https://science.nasa.gov/uranus/'
    },
    {
      id: 'neptune',
      name: 'Neptune',
      image: './Screenshot 2026-02-14 010252.png',
      orbitalPeriodDays: 60182,
      semimajorAxisAU: 30.07,
      meanOrbitalSpeedKmS: 5.43,
      rotationPeriodHours: 16.11,
      radiusPx: 22,
      blurb: 'A distant ice giant with fast winds and deep blue color.',
      nasaLink: 'https://science.nasa.gov/neptune/'
    },
  ]

  const MOONS = [
    { id: 'moon', name: 'Moon', primary: 'Earth', blurb: 'Stabilizes Earth’s tilt and drives tides.' },
    { id: 'io', name: 'Io', primary: 'Jupiter', blurb: 'The most volcanically active world known.' },
    { id: 'europa', name: 'Europa', primary: 'Jupiter', blurb: 'Likely has a global ocean beneath its ice.' },
    { id: 'titan', name: 'Titan', primary: 'Saturn', blurb: 'Thick atmosphere and methane lakes.' },
    { id: 'enceladus', name: 'Enceladus', primary: 'Saturn', blurb: 'Ejects water-ice plumes from its south pole.' },
    { id: 'triton', name: 'Triton', primary: 'Neptune', blurb: 'Orbits backwards; likely captured long ago.' },
  ]

  const PLANETS_BY_ID = Object.fromEntries(PLANETS.map((p) => [p.id, p]))

  return { PLANETS, PLANETS_BY_ID, MOONS }
})()

