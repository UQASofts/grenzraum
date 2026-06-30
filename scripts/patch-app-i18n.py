#!/usr/bin/env python3
"""Patch App.tsx for EN/DE/CS i18n."""
from pathlib import Path

APP = Path(__file__).resolve().parents[1] / "src" / "App.tsx"
content = APP.read_text()

IMPORT_BLOCK = '''import { useLanguage } from "./context/LanguageContext";
import { PublicLanguageSwitcher } from "./components/LanguageSwitcher";
import {
  tr as i18nTr,
  getPoiName,
  getPoiDescription,
  getPoiSecondaryName,
} from "./i18n/language";'''

if "useLanguage" not in content:
    content = content.replace(
        'import { useData } from "./context/DataContext";',
        f'import {{ useData }} from "./context/DataContext";\n{IMPORT_BLOCK}',
    )

content = content.replace(
    '  const [language, setLanguage] = useState<"en" | "cs">("en");',
    "  const { language, setLanguage } = useLanguage();\n  const txt = (en: string, de: str, cs: string) => i18nTr(language, en, de, cs);",
)

# Fix typo de: str -> de: string
content = content.replace("de: str,", "de: string,")

SIMPLE = {
    'language === "en" ? "Home" : "Domů"': 'txt("Home", "Startseite", "Domů")',
    'language === "en" ? "Explorer Map" : "Mapa výletů"': 'txt("Explorer Map", "Entdecker-Karte", "Mapa výletů")',
    'language === "en" ? "Stamp Pass" : "Pas razítek"': 'txt("Stamp Pass", "Stempelpass", "Pas razítek")',
    'language === "en" ? "Sign In" : "Přihlásit se"': 'txt("Sign In", "Anmelden", "Přihlásit se")',
    'language === "en" ? "Log Out" : "Odhlásit"': 'txt("Log Out", "Abmelden", "Odhlásit")',
    'language === "en" ? "Bavarian Forest & Šumava Adventure" : "Dobrodružství na Šumavě a v Bavorském Lese"': 'txt("Bavarian Forest & Šumava Adventure", "Bayerischer Wald & Šumava", "Dobrodružství na Šumavě a v Bavorském Lese")',
    'language === "en" ? "Search Black Lake, White Tower..." : "Hledat Černé jezero, Bílou věž..."': 'txt("Search Black Lake, White Tower...", "Schwarzer See, Weißer Turm suchen...", "Hledat Černé jezero, Bílou věž...")',
    'language === "en" ? "Search Map" : "Hledat na mapě"': 'txt("Search Map", "Karte durchsuchen", "Hledat na mapě")',
    'language === "en" ? "Popular Categories" : "Oblíbené Kategorie"': 'txt("Popular Categories", "Beliebte Kategorien", "Oblíbené Kategorie")',
    'language === "en" ? "Featured Destinations" : "Doporučené Cíle"': 'txt("Featured Destinations", "Empfohlene Ziele", "Doporučené Cíle")',
    'language === "en" ? "ADVENTURE IN YOUR POCKET" : "DOBRODRUŽSTVÍ VE VAŠÍ KAPSE"': 'txt("ADVENTURE IN YOUR POCKET", "ABENTEUER IN DER TASCHE", "DOBRODRUŽSTVÍ VE VAŠÍ KAPSE")',
    'language === "en" ? "My Stamp Collection" : "Moje sbírka razítek"': 'txt("My Stamp Collection", "Meine Stempelsammlung", "Moje sbírka razítek")',
    'language === "en" ? "Cross-Border Explorer Map" : "Přeshraniční interaktivní mapa"': 'txt("Cross-Border Explorer Map", "Grenzüberschreitende Entdecker-Karte", "Přeshraniční interaktivní mapa")',
    'language === "en" ? "Search locations..." : "Hledat lokalitu..."': 'txt("Search locations...", "Orte suchen...", "Hledat lokalitu...")',
    'language === "en" ? "Back to Home" : "Zpět na úvod"': 'txt("Back to Home", "Zur Startseite", "Zpět na úvod")',
    'language === "en" ? "Weather" : "Počasí"': 'txt("Weather", "Wetter", "Počasí")',
    'language === "en" ? "About the Destination" : "O této destinaci"': 'txt("About the Destination", "Über das Ziel", "O této destinaci")',
    'language === "en" ? "Opening Hours" : "Otevírací doba"': 'txt("Opening Hours", "Öffnungszeiten", "Otevírací doba")',
    'language === "en" ? "Difficulty" : "Náročnost cesty"': 'txt("Difficulty", "Schwierigkeit", "Náročnost cesty")',
    'language === "en" ? "Easy Trail. Paved & forest paths." : "Lehká trasa. Zpevněné a lesní cesty."': 'txt("Easy Trail. Paved & forest paths.", "Leichte Route. Feste und Waldwege.", "Lehká trasa. Zpevněné a lesní cesty.")',
    'language === "en" ? "Moderate Trail. Some steep slopes." : "Střední trasa. Místy strmější stoupání."': 'txt("Moderate Trail. Some steep slopes.", "Mittlere Route. Teils steilere Anstiege.", "Střední trasa. Místy strmější stoupání.")',
    'language === "en" ? "Challenging Climb. Rugged wilderness." : "Náročný výstup. Drsný terén divočiny."': 'txt("Challenging Climb. Rugged wilderness.", "Anspruchsvoller Aufstieg. Wildes Gelände.", "Náročný výstup. Drsný terén divočiny.")',
    'language === "en" ? "Facilities" : "Vybavení okolí"': 'txt("Facilities", "Ausstattung", "Vybavení okolí")',
    'language === "en" ? "In-town amenities. Restrooms inside." : "Městské zázemí. Toalety uvnitř."': 'txt("In-town amenities. Restrooms inside.", "Stadtzentrum. Toiletten innen.", "Městské zázemí. Toalety uvnitř.")',
    'language === "en" ? "Parking nearby. Restrooms at trailhead." : "Parkování poblíž. Toalety na začátku stezky."': 'txt("Parking nearby. Restrooms at trailhead.", "Parkplatz in der Nähe. Toiletten am Wanderstart.", "Parkování poblíž. Toalety na začátku stezky.")',
    'language === "en" ? "Digital Explorer Stamp" : "Digitální razítko objevitele"': 'txt("Digital Explorer Stamp", "Digitaler Entdecker-Stempel", "Digitální razítko objevitele")',
    'language === "en" ? "Open Scanner" : "Otevřít Skener"': 'txt("Open Scanner", "Scanner öffnen", "Otevřít Skener")',
    'language === "en" ? "View Full Map" : "Zobrazit mapu"': 'txt("View Full Map", "Vollständige Karte", "Zobrazit mapu")',
    'language === "en" ? "Collect Digital Stamp" : "Získat digitální razítko"': 'txt("Collect Digital Stamp", "Digitalen Stempel sammeln", "Získat digitální razítko")',
    'language === "en" ? "Navigate" : "Navigovat"': 'txt("Navigate", "Navigation", "Navigovat")',
    'language === "en" ? "Saved" : "Uloženo"': 'txt("Saved", "Gespeichert", "Uloženo")',
    'language === "en" ? "Save" : "Uložit"': 'txt("Save", "Speichern", "Uložit")',
    'language === "en" ? "Trek Details" : "Podrobnosti výstupu"': 'txt("Trek Details", "Tourendetails", "Podrobnosti výstupu")',
    'language === "en" ? "Elevation Gain" : "Převýšení"': 'txt("Elevation Gain", "Höhenmeter", "Převýšení")',
    'language === "en" ? "Est. Time" : "Odhadovaný čas"': 'txt("Est. Time", "Geschätzte Zeit", "Odhadovaný čas")',
    'language === "en" ? "Distance" : "Délka trasy"': 'txt("Distance", "Strecke", "Délka trasy")',
    'language === "en" ? "Discover More Nearby" : "Objevte další cíle v okolí"': 'txt("Discover More Nearby", "Mehr in der Nähe entdecken", "Objevte další cíle v okolí")',
    'language === "en" ? "See all attractions" : "Zobrazit všechny cíle"': 'txt("See all attractions", "Alle Ziele anzeigen", "Zobrazit všechny cíle")',
    'language === "en" ? "Stamps Collected" : "Získaná razítka"': 'txt("Stamps Collected", "Gesammelte Stempel", "Získaná razítka")',
    'language === "en" ? "Secret Tips" : "Tajné tipy"': 'txt("Secret Tips", "Geheimtipps", "Tajné tipy")',
    'language === "en" ? "Collect Nearest Stamp" : "Získat nejbližší razítko"': 'txt("Collect Nearest Stamp", "Nächsten Stempel sammeln", "Získat nejbližší razítko")',
    'language === "en" ? "Reset Stamp Pass" : "Resetovat razítka"': 'txt("Reset Stamp Pass", "Stempelpass zurücksetzen", "Resetovat razítka")',
    'language === "en" ? "Stamp Collected!" : "Razítko získáno!"': 'txt("Stamp Collected!", "Stempel gesammelt!", "Razítko získáno!")',
    'language === "en" ? "Thank you for subscribing!" : "Děkujeme za přihlášení!"': 'txt("Thank you for subscribing!", "Danke für Ihre Anmeldung!", "Děkujeme za přihlášení!")',
    'language === "en" ? "Requesting device GPS coordinates..." : "Vyžadování GPS souřadnic ze zařízení..."': 'txt("Requesting device GPS coordinates...", "GPS-Koordinaten werden angefordert...", "Vyžadování GPS souřadnic ze zařízení...")',
    'language === "en" ? poi.name : poi.czName': 'getPoiName(poi, language)',
    'language === "en" ? poi.description : poi.czDescription': 'getPoiDescription(poi, language)',
    'language === "en" ? activePoi.name : activePoi.czName': 'getPoiName(activePoi, language)',
    'language === "en" ? activePoi.czName : activePoi.name': 'getPoiSecondaryName(activePoi, language)',
    'language === "en" ? activePoi.description : activePoi.czDescription': 'getPoiDescription(activePoi, language)',
    'language === "en" ? activePoi.name : activePoi.czName) : ""': 'getPoiName(activePoi, language)) : ""',
    'language === "en" ? categoryLabel : categoryCzLabel': 'txt(categoryLabel, categoryDeLabel, categoryCzLabel)',
    'isSaved ? (language === "en" ? "Saved" : "Uloženo") : (language === "en" ? "Save" : "Uložit")': 'isSaved ? txt("Saved", "Gespeichert", "Uloženo") : txt("Save", "Speichern", "Uložit")',
}

for old, new in SIMPLE.items():
    content = content.replace(old, new)

# Language switcher blocks
OLD_DESKTOP_SWITCH = '''            <button
              onClick={() => setLanguage((prev) => (prev === "en" ? "cs" : "en"))}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold font-mono px-3 py-1.5 rounded-xl cursor-pointer text-slate-600 hover:text-slate-900 transition-colors"
            >
              {language === "en" ? "CZ" : "EN"}
            </button>'''

NEW_DESKTOP_SWITCH = '''            <PublicLanguageSwitcher
              language={language}
              onChange={setLanguage}
            />'''

content = content.replace(OLD_DESKTOP_SWITCH, NEW_DESKTOP_SWITCH)

OLD_MOBILE_SWITCH = '''            <button
              onClick={() => setLanguage((prev) => (prev === "en" ? "cs" : "en"))}
              className="bg-white border border-slate-200 text-xs font-mono px-2 py-1.5 rounded-lg text-slate-600"
            >
              {language === "en" ? "CZ" : "EN"}
            </button>'''

NEW_MOBILE_SWITCH = '''            <PublicLanguageSwitcher
              language={language}
              onChange={setLanguage}
              compact
            />'''

content = content.replace(OLD_MOBILE_SWITCH, NEW_MOBILE_SWITCH)

APP.write_text(content)
print("Patched App.tsx")
