#!/usr/bin/env python3
"""Add deName/deDescription to POIs in data.ts if missing."""
import re
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "src" / "data.ts"

GERMAN = {
    "black-lake": (
        "Schwarzer See",
        "Der größte Natursee der Tschechischen Republik, eingefasst von den dunklen, unberührten Fichtenwäldern des Nationalparks Šumava. Der See wirkt tief schwarz durch die Spiegelung der dichten Wälder und des dunklen Seebodens.",
    ),
    "klatovy-oldtown": (
        "Klatovy Altstadt",
        "Das historische Herz von Klatovy, im 13. Jahrhundert gegründet. Barocke Architektur, der majestätische Weiße Turm mit Panoramablick auf die Šumava-Gipfel und erhaltene mittelalterliche Befestigungen.",
    ),
    "pancir-summit": (
        "Gipfel Pancíř",
        "Mit 1.214 Metern einer der bekanntesten Aussichtsgipfel der Šumava. Oben befindet sich eine Berghütte von 1923 mit hölzernem Aussichtsturm und grenzüberschreitendem Blick bis zu den Alpen.",
    ),
    "devils-lake": (
        "Teufelssee",
        "Der zweitgrößte Gletschersee im Böhmer Wald unter der steilen Felswand des Jezerní hora. Einer Legende nach ertrank hier der Teufel und hinterließ das mystische Tal.",
    ),
    "spicak-lookout": (
        "Aussichtsturm Špičák",
        "Auf dem Gipfel des Špičák (1.202 m) bietet dieser 26 Meter hohe Holzaussichtsturm Panoramen über die grenzüberschreitende Region Šumava-Bayerischer Wald.",
    ),
    "white-gorge-waterfall": (
        "Wasserfall Weiße Schlucht",
        "Der einzige natürliche Wasserfall im Nationalpark Šumava, wo der Bílý potok 14 Meter in eine felsige Schlucht stürzt – mit einer hölzernen Aussichtsplattform direkt über dem Wasser.",
    ),
    "klatovy-catacombs": (
        "Klatower Katakomben",
        "Eine düstere Krypta unter der Jesuitenkirche. Dank eines genialen Belüftungssystems sind mumifizierte Leichen aus dem 17. Jahrhundert hier erhalten geblieben.",
    ),
    "glass-ark": (
        "Glas-Arche",
        "Eine künstlerische Installation nahe der bayerisch-tschechischen Grenze: ein grün leuchtendes Glasgefäß, getragen von geschnitzten Holzhänden – Symbol für Hoffnung und grenzüberschreitende Verbindung.",
    ),
}

text = DATA.read_text()
for poi_id, (de_name, de_desc) in GERMAN.items():
    if f'id: "{poi_id}"' not in text:
        continue
  # Find block and insert after czDescription line if deName not present
    pattern = rf'(id: "{poi_id}",.*?czDescription: "[^"]*",)\n'
    if re.search(rf'id: "{poi_id}".*?deName:', text, re.DOTALL):
        continue
    replacement = rf'\1\n    deName: "{de_name}",\n    deDescription: "{de_desc}",\n'
    text, n = re.subn(pattern, replacement, text, count=1, flags=re.DOTALL)
    if n:
        print(f"Updated {poi_id}")

DATA.write_text(text)
