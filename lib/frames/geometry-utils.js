/**
 * Utility per calcoli geometrici sui frame
 * Tutte le misure sono in millimetri (mm)
 */

/**
 * Calcola le coordinate (x, y) di tutti i punti del poligono
 * @param {Array} lati - Array di oggetti lato con lunghezza
 * @param {Array} angoli - Array di oggetti angolo con gradi
 * @returns {Array} Array di punti [{x, y}, ...]
 */
export function calculatePoints(lati, angoli) {
  if (!lati || !angoli || lati.length === 0) {
    return [];
  }

  const points = [];
  let currentX = 0;
  let currentY = 0;
  let currentAngle = 0; // Angolo direzione corrente in radianti

  points.push({ x: currentX, y: currentY });

  for (let i = 0; i < lati.length; i++) {
    const latoLength = lati[i].lunghezza;

    // Calcola nuovo punto seguendo la direzione corrente
    currentX += latoLength * Math.cos(currentAngle);
    currentY += latoLength * Math.sin(currentAngle);

    points.push({ x: currentX, y: currentY });

    // Aggiorna angolo per il prossimo lato
    if (i < angoli.length) {
      // L'angolo interno determina la rotazione
      // 180° - angolo interno = angolo esterno di rotazione
      const angoloInterno = angoli[i].gradi;
      const angoloEsternoRad = ((180 - angoloInterno) * Math.PI) / 180;
      currentAngle += angoloEsternoRad;
    }
  }

  return points;
}

/**
 * Calcola l'area del poligono usando la formula di Gauss (Shoelace)
 * @param {Array} points - Array di punti [{x, y}, ...]
 * @returns {number} Area in mm²
 */
export function calculateArea(points) {
  if (!points || points.length < 3) {
    return 0;
  }

  let area = 0;
  const n = points.length;

  for (let i = 0; i < n - 1; i++) {
    area += points[i].x * points[i + 1].y;
    area -= points[i + 1].x * points[i].y;
  }

  // Chiudi il poligono
  area += points[n - 1].x * points[0].y;
  area -= points[0].x * points[n - 1].y;

  return Math.abs(area / 2);
}

/**
 * Calcola il perimetro del poligono
 * @param {Array} lati - Array di oggetti lato con lunghezza
 * @returns {number} Perimetro in mm
 */
export function calculatePerimeter(lati) {
  if (!lati || lati.length === 0) {
    return 0;
  }

  return lati.reduce((sum, lato) => sum + lato.lunghezza, 0);
}

/**
 * Verifica se il poligono è valido geometricamente
 * @param {Array} lati - Array di oggetti lato
 * @param {Array} angoli - Array di oggetti angolo
 * @returns {Object} {valid: boolean, error: string}
 */
export function isValidPolygon(lati, angoli) {
  // Verifica che ci siano dati
  if (!lati || !angoli || lati.length < 3 || angoli.length < 3) {
    return { valid: false, error: 'Servono almeno 3 lati e 3 angoli' };
  }

  // Verifica che numero lati = numero angoli
  if (lati.length !== angoli.length) {
    return { valid: false, error: 'Numero lati e angoli deve essere uguale' };
  }

  // Verifica che tutti i lati siano positivi
  for (const lato of lati) {
    if (lato.lunghezza <= 0) {
      return { valid: false, error: `Lato ${lato.label} deve essere > 0` };
    }
    if (lato.lunghezza < 300 || lato.lunghezza > 2500) {
      return { valid: false, error: `Lato ${lato.label} fuori range (300-2500mm)` };
    }
  }

  // Verifica che tutti gli angoli siano nel range 0-180
  for (const angolo of angoli) {
    if (angolo.gradi < 0 || angolo.gradi > 180) {
      return { valid: false, error: `${angolo.label} fuori range (0-180°)` };
    }
  }

  // Verifica somma angoli interni = (n-2) × 180°
  const n = angoli.length;
  const sommaAttesa = (n - 2) * 180;
  const sommaReale = angoli.reduce((sum, ang) => sum + ang.gradi, 0);
  const tolleranza = 1; // 1 grado di tolleranza

  if (Math.abs(sommaReale - sommaAttesa) > tolleranza) {
    return {
      valid: false,
      error: `Somma angoli deve essere ${sommaAttesa}° (attuale: ${sommaReale}°)`
    };
  }

  // Verifica che il poligono si chiuda
  const points = calculatePoints(lati, angoli);
  if (points.length > 0) {
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const distanza = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) +
      Math.pow(lastPoint.y - firstPoint.y, 2)
    );

    if (distanza > 10) { // Tolleranza 10mm
      return {
        valid: false,
        error: 'Il poligono non si chiude correttamente'
      };
    }
  }

  return { valid: true, error: null };
}

/**
 * Converte mm² in m²
 * @param {number} areaMm2 - Area in mm²
 * @returns {number} Area in m²
 */
export function mm2ToM2(areaMm2) {
  return areaMm2 / 1000000;
}

/**
 * Formatta area per visualizzazione
 * @param {number} areaMm2 - Area in mm²
 * @returns {string} Area formattata (es. "1.68 m²")
 */
export function formatArea(areaMm2) {
  const areaM2 = mm2ToM2(areaMm2);
  return `${areaM2.toFixed(2)} m²`;
}

/**
 * Formatta perimetro per visualizzazione
 * @param {number} perimetroMm - Perimetro in mm
 * @returns {string} Perimetro formattato (es. "5200 mm")
 */
export function formatPerimeter(perimetroMm) {
  return `${Math.round(perimetroMm)} mm`;
}

/**
 * Calcola il bounding box del poligono
 * @param {Array} points - Array di punti
 * @returns {Object} {minX, minY, maxX, maxY, width, height}
 */
export function calculateBoundingBox(points) {
  if (!points || points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  points.forEach(point => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}
