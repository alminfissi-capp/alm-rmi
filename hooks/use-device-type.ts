import * as React from "react"

/**
 * BREAKPOINT TABLET-FIRST per RMI
 *
 * Sistema ottimizzato per uso professionale in cantiere con tablet + pennino
 *
 * BREAKPOINTS:
 * - mobile:  0-767px    (smartphone, uso secondario)
 * - tablet:  768-1023px (TARGET PRIMARIO - iPad/Android tablet)
 * - desktop: 1024px+    (ufficio, post-elaborazione)
 *
 * FILOSOFIA:
 * Il design BASE è ottimizzato per tablet (768-1023px)
 * Mobile e desktop sono ADATTAMENTI dal design tablet
 */

export const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024, max: Infinity }
} as const

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

/**
 * Hook per rilevare il tipo di dispositivo corrente
 * Ritorna: 'mobile' | 'tablet' | 'desktop'
 *
 * @example
 * const device = useDeviceType()
 * if (device === 'tablet') {
 *   // Logica ottimizzata per tablet
 * }
 */
export function useDeviceType(): DeviceType | undefined {
  const [deviceType, setDeviceType] = React.useState<DeviceType | undefined>(undefined)

  React.useEffect(() => {
    const getDeviceType = (width: number): DeviceType => {
      if (width < BREAKPOINTS.tablet.min) return 'mobile'
      if (width <= BREAKPOINTS.tablet.max) return 'tablet'
      return 'desktop'
    }

    const updateDeviceType = () => {
      setDeviceType(getDeviceType(window.innerWidth))
    }

    // Media queries per ogni breakpoint
    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile.max}px)`)
    const tabletQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.tablet.min}px) and (max-width: ${BREAKPOINTS.tablet.max}px)`
    )
    const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop.min}px)`)

    // Listener per cambio device
    const onChange = () => updateDeviceType()

    mobileQuery.addEventListener('change', onChange)
    tabletQuery.addEventListener('change', onChange)
    desktopQuery.addEventListener('change', onChange)

    // Inizializza
    updateDeviceType()

    return () => {
      mobileQuery.removeEventListener('change', onChange)
      tabletQuery.removeEventListener('change', onChange)
      desktopQuery.removeEventListener('change', onChange)
    }
  }, [])

  return deviceType
}

/**
 * Hook per verificare se siamo su tablet (TARGET PRIMARIO)
 *
 * @example
 * const isTablet = useIsTablet()
 * if (isTablet) {
 *   // Usa layout split-screen ottimale
 * }
 */
export function useIsTablet(): boolean {
  const deviceType = useDeviceType()
  return deviceType === 'tablet'
}

/**
 * Hook per verificare se siamo su mobile
 *
 * @example
 * const isMobile = useIsMobile()
 * if (isMobile) {
 *   // Semplifica UI per schermi piccoli
 * }
 */
export function useIsMobileDevice(): boolean {
  const deviceType = useDeviceType()
  return deviceType === 'mobile'
}

/**
 * Hook per verificare se siamo su desktop
 *
 * @example
 * const isDesktop = useIsDesktop()
 * if (isDesktop) {
 *   // Espandi info, aggiungi sidebar extra
 * }
 */
export function useIsDesktop(): boolean {
  const deviceType = useDeviceType()
  return deviceType === 'desktop'
}

/**
 * Hook combinato per logica condizionale avanzata
 *
 * @example
 * const { isMobile, isTablet, isDesktop } = useResponsive()
 *
 * // Logica complessa
 * const columns = isMobile ? 1 : isTablet ? 2 : 4
 */
export function useResponsive() {
  const deviceType = useDeviceType()

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',

    // Alias per compatibilità con vecchio hook
    isMobileOrTablet: deviceType === 'mobile' || deviceType === 'tablet',
    isTabletOrDesktop: deviceType === 'tablet' || deviceType === 'desktop',
  }
}
