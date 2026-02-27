"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"

export type Language = "en" | "he"

type Translations = {
  nav: {
    work: string
    about: string
    exhibitions: string
    contact: string
    explore: string
  }
  hero: {
    videoPlaceholder: string
  }
  about: {
    title: string
    bio: string[]
  }
  work: {
    title: string
    categories: {
      landscape: string
      organic: string
      "still-life": string
      human: string
      spheres: string
      "architecture-of-destruction": string
      copies: string
    }
    backToGallery: string
    viewDetails: string
    artwork: string
    artworks: string
    mainImage: string
    detailImages: string
  }
  exhibitions: {
    title: string
    curator: string
    items: {
      year: string
      title: string
      venue: string
      location: string
      curator?: string
    }[]
  }
  contact: {
    title: string
    name: string
    email: string
    message: string
    send: string
    emailLabel: string
    whatsappLabel: string
    success: string
    error: string
  }
  footer: {
    rights: string
  }
  theme: {
    light: string
    dark: string
  }
  language: {
    en: string
    he: string
  }
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      work: "Artwork",
      about: "About the Artist",
      exhibitions: "Exhibitions",
      contact: "Contact",
      explore: "Explore",
    },
    hero: {
      videoPlaceholder: "Digital Art Video",
    },
    about: {
      title: "About the Artist",
      bio: [
        "Tali Assa is a painter, psychologist, and jazz musician whose work emerges from four decades of parallel practice across these disciplines. Her artistic practice is rooted in intensive study at the Tachana Studio under the instruction of Aram Gershuni and David Nipo, where three years of painting from direct observation of human models and still life built the foundation of her technical and conceptual approach.",
        "Over the years, her practice has evolved from naturalistic painting to abstraction. While her early work emphasized mimesis and realistic relationships of tonality and color, her more recent bodies of work shift the focus toward texture, rhythm, and the construction of abstract compositions.",
      ],
    },
    work: {
      title: "Artwork",
      categories: {
        landscape: "Landscape",
        organic: "Organic",
        "still-life": "Still Life",
        human: "Human",
        spheres: "Spheres",
        "architecture-of-destruction": "Architecture of Destruction",
        copies: "Copies",
      },
      backToGallery: "Back to Gallery",
      viewDetails: "View Details",
      artwork: "artwork",
      artworks: "artworks",
      mainImage: "Main Image",
      detailImages: "Detail Images",
    },
    exhibitions: {
      title: "Group Exhibitions",
      curator: "Curator",
      items: [
        {
          year: "2024",
          title: "MFA Graduation Exhibition",
          venue: "Haifa Museum of Art and Minshar",
          location: "Israel",
        },
        {
          year: "2018",
          title: "Summer Exhibition",
          venue: "Rothschild Gallery",
          location: "Tel Aviv",
        },
        {
          year: "2018",
          title: "Migration, Accumulation, and Memory",
          venue: "Menorat Layla Festival",
          location: "Israel",
          curator: "Uri Dromer",
        },
        {
          year: "2017",
          title: "Tenth Birthday",
          venue: "Makom La'Art",
          location: "Israel",
          curator: "Nir Harmat",
        },
        {
          year: "2017",
          title: "Art Sale in Support of the Fight Against AIDS",
          venue: "Bank Hapoalim",
          location: "Israel",
        },
        {
          year: "2016–2017",
          title: "Participation in Auctions",
          venue: "Montefiore Gallery",
          location: "Tel Aviv",
        },
        {
          year: "2016",
          title: "Graduates Exhibition — HaTachana Master Class",
          venue: "Liza Gershuni Gallery",
          location: "Tel Aviv",
        },
      ],
    },
    contact: {
      title: "Contact",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
      success: "Message sent — thank you!",
      error: "Something went wrong. Please try again.",
    },
    footer: {
      rights: "All Rights Reserved",
    },
    theme: {
      light: "Light",
      dark: "Dark",
    },
    language: {
      en: "EN",
      he: "עב",
    },
  },
  he: {
    nav: {
      work: "אומנות",
      about: "על האמנית",
      exhibitions: "תערוכות",
      contact: "צור קשר",
      explore: "חקור",
    },
    hero: {
      videoPlaceholder: "וידאו אמנות דיגיטלית",
    },
    about: {
      title: "על האמנית",
      bio: [
        "טלי אסא היא ציירת, פסיכולוגית ומוזיקאית ג׳אז, שעבודתה צומחת מתוך ארבעה עשורים של עיסוק מקביל בשלושת התחומים הללו. עשייתה האמנותית נטועה בלימוד אינטנסיבי בסטודיו התחנה בהנחיית ארם גרשוני ודוד ניפו, שם שלוש שנות ציור מתוך התבוננות ישירה במודלים חיים ובטבע דומם ביססו את התשתית הטכנית והרעיונית של עבודתה.",
        "במהלך השנים התפתחה עבודתה מציור נטורליסטי אל עבר הפשטה. בעוד שעבודותיה המוקדמות הדגישו מימזיס ויחסים ריאליסטיים של טונאליות וצבע, בגופי העבודה המאוחרים יותר מושם הדגש על מרקם, קצב ובניית קומפוזיציות מופשטות.",
      ],
    },
    work: {
      title: "אומנות",
      categories: {
        landscape: "נוף",
        organic: "אורגני",
        "still-life": "טבע דומם",
        human: "אנושי",
        spheres: "ספירות",
        "architecture-of-destruction": "ארכיטקטורה של הרס",
        copies: "העתקים",
      },
      backToGallery: "חזרה לגלריה",
      viewDetails: "צפה בפרטים",
      artwork: "עבודה",
      artworks: "עבודות",
      mainImage: "תמונה ראשית",
      detailImages: "תמונות פרטים",
    },
    exhibitions: {
      title: "תערוכות קבוצתיות",
      curator: "אוצר",
      items: [
        {
          year: "2024",
          title: "תערוכת בוגרי MFA",
          venue: "מוזיאון חיפה לאמנות ומנשר",
          location: "ישראל",
        },
        {
          year: "2018",
          title: "תערוכת קיץ",
          venue: "גלריה רוטשילד",
          location: "תל אביב",
        },
        {
          year: "2018",
          title: "הגירה, הצטברות וזיכרון",
          venue: "פסטיבל מנורת ליילה",
          location: "ישראל",
          curator: "אורי דרומר",
        },
        {
          year: "2017",
          title: "יום הולדת עשר",
          venue: "מקום לאמנות",
          location: "ישראל",
          curator: "ניר חרמט",
        },
        {
          year: "2017",
          title: "מכירת אמנות לתמיכה במאבק באיידס",
          venue: "בנק הפועלים",
          location: "ישראל",
        },
        {
          year: "2016–2017",
          title: "השתתפות במכירות פומביות",
          venue: "גלריה מונטיפיורי",
          location: "תל אביב",
        },
        {
          year: "2016",
          title: "תערוכת בוגרים — מאסטר קלאס התחנה",
          venue: "גלריה ליזה גרשוני",
          location: "תל אביב",
        },
      ],
    },
    contact: {
      title: "צור קשר",
      name: "שם",
      email: "אימייל",
      message: "הודעה",
      send: "שלח הודעה",
      emailLabel: "אימייל",
      whatsappLabel: "וואטסאפ",
      success: "ההודעה נשלחה — תודה!",
      error: "משהו השתבש. נסה שוב.",
    },
    footer: {
      rights: "כל הזכויות שמורות",
    },
    theme: {
      light: "בהיר",
      dark: "כהה",
    },
    language: {
      en: "EN",
      he: "עב",
    },
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "he")) {
      setLanguage(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "he" ? "rtl" : "ltr"
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language],
    dir: (language === "he" ? "rtl" : "ltr") as "ltr" | "rtl",
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
