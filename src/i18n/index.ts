import { Language } from "@/types";

export const languages = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
};

type TranslationKey = {
  [key: string]: string;
};

interface Translations {
  [key: string]: TranslationKey;
}

export const translations: Translations = {
  de: {
    // Allgemein
    loading: "Lädt",
    error: "Fehler",
    search: "Suche",
    filter: "Filter",
    found: "gefunden",
    details: "Details",
    website: "Website",
    openingHours: "Öffnungszeiten",
    features: "Ausstattung & Merkmale",
    reviews: "Bewertungen",
    anonymous: "Anonym",
    viewOnMap: "Auf Karte anzeigen",
    noAddressAvailable: "Keine Adresse verfügbar",
    searchSchools: "Schwimmschulen suchen",
    errorLoadingSchools: "Fehler beim Laden der Schwimmschulen",
    noSchoolsFound: "Keine Schwimmschulen gefunden",
    
    // Wochentage
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",
    
    // Kursstufen
    beginner: "Anfänger",
    intermediate: "Fortgeschritten",
    advanced: "Fortgeschritten",
    
    // Andere
    sponsored: "Gesponsert",
    years: "Jahre",
    level: "Level",
    age: "Alter",
    refineSearch: "Suche verfeinern",
    keywordSearch: "Suche nach Stichwort",
    searchPlaceholder: "z.B. Schwimmkurs, Wassergewöhnung",
    location: "Standort",
    locationPlaceholder: "Stadt oder PLZ",
    priceRange: "Preisbereich",
    ageGroup: "Altersgruppe",
    courseLevel: "Kursstufe",
  },
  en: {
    // General
    loading: "Loading",
    error: "Error",
    search: "Search",
    filter: "Filter",
    found: "found",
    details: "Details",
    website: "Website",
    openingHours: "Opening Hours",
    features: "Features & Equipment",
    reviews: "Reviews",
    anonymous: "Anonymous",
    viewOnMap: "View on map",
    noAddressAvailable: "No address available",
    searchSchools: "Search swimming schools",
    errorLoadingSchools: "Error loading swimming schools",
    noSchoolsFound: "No swimming schools found",
    
    // Days of week
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    
    // Course levels
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    
    // Other
    sponsored: "Sponsored",
    years: "years",
    level: "Level",
    age: "Age",
    refineSearch: "Refine your search",
    keywordSearch: "Search by keyword",
    searchPlaceholder: "e.g. swimming course, water familiarization",
    location: "Location",
    locationPlaceholder: "City or postal code",
    priceRange: "Price range",
    ageGroup: "Age group",
    courseLevel: "Course level",
  },
  es: {
    // General
    loading: "Cargando",
    error: "Error",
    search: "Búsqueda",
    filter: "Filtro",
    found: "encontrado",
    details: "Detalles",
    website: "Sitio web",
    openingHours: "Horarios de apertura",
    features: "Características",
    reviews: "Reseñas",
    anonymous: "Anónimo",
    viewOnMap: "Ver en el mapa",
    noAddressAvailable: "Dirección no disponible",
    searchSchools: "Buscar escuelas de natación",
    errorLoadingSchools: "Error al cargar las escuelas de natación",
    noSchoolsFound: "No se encontraron escuelas de natación",
    
    // Days of week
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
    
    // Course levels
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    
    // Other
    sponsored: "Patrocinado",
    years: "años",
    level: "Nivel",
    age: "Edad",
    refineSearch: "Refinar búsqueda",
    keywordSearch: "Búsqueda por palabra clave",
    searchPlaceholder: "ej. curso de natación, adaptación al agua",
    location: "Ubicación",
    locationPlaceholder: "Ciudad o código postal",
    priceRange: "Rango de precio",
    ageGroup: "Grupo de edad",
    courseLevel: "Nivel del curso",
  },
  fr: {
    // General
    loading: "Chargement",
    error: "Erreur",
    search: "Recherche",
    filter: "Filtre",
    found: "trouvé",
    details: "Détails",
    website: "Site web",
    openingHours: "Heures d'ouverture",
    features: "Caractéristiques",
    reviews: "Avis",
    anonymous: "Anonyme",
    viewOnMap: "Voir sur la carte",
    noAddressAvailable: "Adresse non disponible",
    searchSchools: "Rechercher des écoles de natation",
    errorLoadingSchools: "Erreur lors du chargement des écoles de natation",
    noSchoolsFound: "Aucune école de natation trouvée",
    
    // Days of week
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",
    
    // Course levels
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    
    // Other
    sponsored: "Sponsorisé",
    years: "ans",
    level: "Niveau",
    age: "Âge",
    refineSearch: "Affiner votre recherche",
    keywordSearch: "Recherche par mot-clé",
    searchPlaceholder: "ex. cours de natation, familiarisation avec l'eau",
    location: "Emplacement",
    locationPlaceholder: "Ville ou code postal",
    priceRange: "Gamme de prix",
    ageGroup: "Groupe d'âge",
    courseLevel: "Niveau de cours",
  },
  it: {
    // General
    loading: "Caricamento",
    error: "Errore",
    search: "Ricerca",
    filter: "Filtro",
    found: "trovato",
    details: "Dettagli",
    website: "Sito web",
    openingHours: "Orari di apertura",
    features: "Caratteristiche",
    reviews: "Recensioni",
    anonymous: "Anonimo",
    viewOnMap: "Visualizza sulla mappa",
    noAddressAvailable: "Indirizzo non disponibile",
    searchSchools: "Cerca scuole di nuoto",
    errorLoadingSchools: "Errore nel caricamento delle scuole di nuoto",
    noSchoolsFound: "Nessuna scuola di nuoto trovata",
    
    // Days of week
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica",
    
    // Course levels
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzato",
    
    // Other
    sponsored: "Sponsorizzato",
    years: "anni",
    level: "Livello",
    age: "Età",
    refineSearch: "Affina la ricerca",
    keywordSearch: "Ricerca per parola chiave",
    searchPlaceholder: "es. corso di nuoto, familiarizzazione con l'acqua",
    location: "Posizione",
    locationPlaceholder: "Città o codice postale",
    priceRange: "Fascia di prezzo",
    ageGroup: "Gruppo di età",
    courseLevel: "Livello del corso",
  },
};

export const getTranslation = (language: Language, key: string): string => {
  return translations[language]?.[key] || key;
};

export const formatPrice = (price: number, currency: string = "€"): string => {
  return `${price} ${currency}`;
};
