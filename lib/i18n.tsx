"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "he"

type Translations = {
  nav: {
    work: string
    about: string
    exhibitions: string
    contact: string
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
      "my-dutch-heroes": string
      "still-life": string
      human: string
      spheres: string
      "architecture-of-destruction": string
      "master-copy": string
    }
    backToGallery: string
    viewDetails: string
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
    },
    hero: {
      videoPlaceholder: "Digital Art Video",
    },
    about: {
      title: "About the Artist",
      bio: [
        "Tali Assa is a painter, psychologist, and jazz musician whose work emerges from four decades of parallel practice across these disciplines. Her artistic practice is rooted in intensive study at HaTachana studio under Aram Gershuni and David Nipo, where three years of daily observation drawing formed a foundation for understanding form, texture, and material.",
        "Her work has evolved through a deliberate process of abstraction, moving beyond representation toward the textures and rhythms that animate her subjects. Drawing, for Assa, is a form of dreaming—an immersive dialogue with the object of observation where she dismantles and reassembles visual information into new compositional possibilities.",
        "Her practice integrates three influences: psychodynamic theory informs her understanding of the subconscious in image-making, while her experience as a jazz musician introduces improvisation and harmonic thinking into the studio. Each work responds to what has accumulated on the surface, a continuous process of material investigation and formal discovery.",
      ],
    },
    work: {
      title: "Artwork",
      categories: {
        landscape: "Landscape",
        "my-dutch-heroes": "My Dutch Heroes",
        "still-life": "Still Life",
        human: "Human",
        spheres: "Spheres",
        "architecture-of-destruction": "Architecture of Destruction",
        "master-copy": "Master Copy",
      },
      backToGallery: "Back to Gallery",
      viewDetails: "View Details",
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
    },
    hero: {
      videoPlaceholder: "וידאו אמנות דיגיטלית",
    },
    about: {
      title: "על האמנית",
      bio: [
        "טלי אסא היא ציירת, פסיכולוגית ומוזיקאית ג'אז שעבודתה מתגבשת מארבעת עשורים של פרקטיקה מקבילה בתחומים אלה. פרקטיקתה האמנותית משורשת בלימודים אינטנסיביים בסטודיו 'התחנה' בהנחיית ארם גרשוני ודוד ניפו, שם שלוש שנות ציור תצפית יומיומי יצרו יסוד להבנת צורה, מרקם וחומר.",
        "עבודתה התפתחה דרך תהליך מכוון של הפשטה, קידום מעבר לייצוג לעבר המרקמים והקצבים המחייים את הנושאים שלה. הציור, עבור אסא, הוא צורה של חלימה—דיאלוג שקוע עם עצם התצפית שבו היא מפרקת ומרכיבת מחדש מידע ויזואלי לאפשרויות קומפוזיציוניות חדשות.",
        "הפרקטיקה שלה משלבת שלוש השפעות: תיאוריה פסיכודינמית מדריכה את הבנתה של התת-הכרת ביצירת תמונה, בעוד שניסיונה כמוזיקאית ג'אז מכניסה אימפרוביזציה וחשיבה הרמונית לסטודיו. כל עבודה מגיבה למה שהצטבר על השטח, תהליך מתמשך של חקירה חומרית ותגלית פורמלית.",
      ],
    },
    work: {
      title: "אומנות",
      categories: {
        landscape: "נוף",
        "my-dutch-heroes": "הגיבורים ההולנדיים שלי",
        "still-life": "טבע דומם",
        human: "אנושי",
        spheres: "ספירות",
        "architecture-of-destruction": "ארכיטקטורה של הרס",
        "master-copy": "העתק מאסטר",
      },
      backToGallery: "חזרה לגלריה",
      viewDetails: "צפה בפרטים",
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

  const value = {
    language,
    setLanguage,
    t: translations[language],
    dir: language === "he" ? "rtl" : ("ltr" as const),
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
