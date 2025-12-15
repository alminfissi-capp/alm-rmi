// ============================================
// Application Configuration Constants
// ============================================

/**
 * API Configuration
 */
export const API_CONFIG = {
  // Request limits
  MAX_QUERY_LIMIT: 1000,
  DEFAULT_QUERY_LIMIT: 50,
  MIN_QUERY_LIMIT: 1,

  // Retry configuration
  MAX_RETRY_ATTEMPTS: 5,
  RETRY_BASE_DELAY_MS: 100,

  // Timeout configuration
  DEFAULT_TIMEOUT_MS: 30000, // 30 seconds
  LONG_TIMEOUT_MS: 60000,    // 60 seconds
} as const

/**
 * Auto-save Configuration
 */
export const AUTOSAVE_CONFIG = {
  DEBOUNCE_DELAY_MS: 3000,     // 3 seconds
  MAX_SAVE_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const

/**
 * Commessa Generation Configuration
 */
export const COMMESSA_CONFIG = {
  PREFIX: 'RMI',
  PROGRESSIVO_DIGITS: 4,
  MAX_GENERATION_ATTEMPTS: 5,
} as const

/**
 * Pagination Configuration
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
} as const

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  ALLOWED_PDF_TYPES: ['application/pdf'] as const,
} as const

/**
 * PDF Generation Configuration
 */
export const PDF_CONFIG = {
  MAX_PAGE_WIDTH: 210,  // A4 width in mm
  MAX_PAGE_HEIGHT: 297, // A4 height in mm
  MARGIN: 10,           // Margin in mm
  DPI: 96,
} as const

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  // Cache durations in seconds
  STATIC_ASSETS: 31536000,    // 1 year
  API_DATA: 300,              // 5 minutes
  USER_DATA: 60,              // 1 minute
  NO_CACHE: 0,
} as const

/**
 * Validation Limits
 */
export const VALIDATION_LIMITS = {
  // Text fields
  MIN_TEXT_LENGTH: 1,
  MAX_TEXT_LENGTH: 255,
  MAX_TEXTAREA_LENGTH: 2000,
  MAX_DESCRIPTION_LENGTH: 5000,

  // Numeric fields
  MIN_NUMERO_PEZZI: 1,
  MAX_NUMERO_PEZZI: 999,
  MIN_DIMENSIONE_MM: 1,
  MAX_DIMENSIONE_MM: 99999,

  // Email
  MAX_EMAIL_LENGTH: 255,
} as const

/**
 * Status Values
 */
export const RILIEVO_STATUS = {
  BOZZA: 'bozza',
  IN_LAVORAZIONE: 'in_lavorazione',
  COMPLETATO: 'completato',
  ARCHIVIATO: 'archiviato',
} as const

/**
 * Tipologie Cliente (Rubrica)
 */
export const CLIENTE_TIPOLOGIE = {
  PRIVATO: 'privato',
  AZIENDA: 'azienda',
  ALTRO: 'altro',
} as const

export const CLIENTE_TIPOLOGIE_LABELS = {
  privato: 'Privato',
  azienda: 'Azienda',
  altro: 'Altro',
} as const

/**
 * HTTP Status Codes (commonly used)
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Non sei autorizzato ad accedere a questa risorsa',
  NOT_FOUND: 'Risorsa non trovata',
  INVALID_INPUT: 'I dati inseriti non sono validi',
  NETWORK_ERROR: 'Errore di connessione. Riprova più tardi.',
  GENERIC_ERROR: 'Si è verificato un errore. Riprova più tardi.',
  DUPLICATE_COMMESSA: 'Numero commessa già esistente',
  GENERATION_FAILED: 'Impossibile generare numero commessa univoco',
} as const

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Salvato con successo',
  CREATED: 'Creato con successo',
  UPDATED: 'Aggiornato con successo',
  DELETED: 'Eliminato con successo',
  EMAIL_SENT: 'Email inviata con successo',
  PDF_GENERATED: 'PDF generato con successo',
} as const

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  ENABLE_OFFLINE_MODE: false,
  ENABLE_PWA: false,
  ENABLE_EXCEL_EXPORT: false,
  ENABLE_ANALYTICS: false,
  ENABLE_ERROR_REPORTING: process.env.NODE_ENV === 'production',
} as const

/**
 * Environment Variables (with defaults)
 */
export const ENV = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const
