import { POI, UserStamp, Achievement, ApiLog } from "./types";

export const INITIAL_POIS: POI[] = [
  {
    id: "black-lake",
    name: "Black Lake",
    czName: "Černé jezero",
    category: "Lakes",
    description: "The largest natural lake in the Czech Republic, framed by the dark, pristine spruce forests of the Šumava National Park. The lake gets its deep, black appearance from the reflection of the surrounding dense woodlands and the dark mud on its bed.",
    czDescription: "Největší přirozené jezero v České republice, obklopené temnými, nedotčenými smrkovými lesy Národního parku Šumava. Jezero získává svůj hluboký, černý vzhled odrazem okolních hustých lesů a tmavého kalu na svém dně.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdoDLdlFg5QJ46VbsW_JopJe9OzH5J47bNMfWMhAaO5Gfc5CJb5nCqkXFWFP40M6IN-LHz2_ZVbFRPUwQcK5hmUrztPyY7-qup3gAKKtpwGVqqSDB2SVurxWJkpgfCYeF6VTimwi0qVQSa4vBQY_D5-ww2t-lqy_GbZyALCfdbENogioMMf9ZjWHt6zGJQtmNnDIxg8TS_S9dgvhpD2HgJvlvcBb3hcXDzsRToYOsJI1R285TxOMi5qT8PAeSm2G_s2OhjSpZhI-Eg",
    elevationGain: "320 m",
    estTime: "2h 45m",
    distance: "6.5 km",
    lat: 49.1794,
    lng: 13.1822,
    stampName: "Green Lung Trail Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuArGvsjOhpYPv5fw2kq8DGRliU-6BabAUK_Bp9GQIp32q_o5q_hPmYHWUeBA11ewfXSAy7G_HiOnyMh68HfmGdHYhBmtY-GSREV9hOLB6YKcs6Lr-EJh3Fy5veuLR0sSPowDo7m4Mman3rTbFBX4pAI7vDHQxTTHAKETi5W0YQhbrGyW_uoESxGs-XMTT_ZG9EvZLTLNfgHwgA-yYrotfOUN5Js3O6qBXsxqy9qBwMkYIgnnYpPr-DgrtE8V1QoG4ol0EvG9dHnsYUc",
    difficulty: "Moderate",
    status: "Synced",
    languages: ["en", "cs", "de"],
    secretTip: false
  },
  {
    id: "klatovy-oldtown",
    name: "Klatovy Old Town",
    czName: "Klatovy Staré Město",
    category: "Museums",
    description: "The historic heart of Klatovy, founded in the 13th century. It features beautiful Baroque architecture, the majestic White Tower offering panoramic views of the Šumava peaks, and a preserved medieval fortification system.",
    czDescription: "Historické srdce Klatov, založené ve 13. století. Vyznačuje se krásnou barokní architekturou, majestátní Bílou věží nabízející panoramatické výhledy na šumavské vrcholky a zachovalým středověkým systémem opevnění.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIIXron1Gho1GeaWQEDAoFLB9ezaAMyTpsMo2msLd9-XKe7_CKf52oRXH5rtYgonAbUAihm19uf0xHNevv0cAEae2f0wyWDsWo6DEwIXf6fvs-q4iUku6uqWGqiwqRbP9nO6oCmrJT1CiXbHNwRmxmx1kEcfolIAUlfxm6IBapyscZKuSDCXbsZ_c0hGAuLYz_MrB_9l2OEQWq5Iiqyw97yHNhDdY-RqXHOAkQ7rctSj5iHf5pqe-7M8hqJz393ZLGkbCntsNYgCtN",
    elevationGain: "40 m",
    estTime: "1h 30m",
    distance: "2.0 km",
    lat: 49.3955,
    lng: 13.2952,
    stampName: "White Tower Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2yrAupLtOjwq3W_mF1nm_hrMsrBuNZlHApu_UcM93eQQe3AYo8OBL4p1wtyyrmMARAxs00XaJC-cPKUoNZ_ocT1MH6oi8BB6U4ix2_pe-PLD6Kn3MU16lsCY8VjOIrQfA0JpzDh-GKgs6hcc7TTH6vyPFFYoMJA2oHI4QVCWFV0A9KsnrqGkeyVeTYWxFVj6bX4fxqgJBrwuAWulA639z3wDKj563-nOQL-Dp5Q4G20fivSUnbQ5LsW56FIIBnNPglYvS03X4Ut9d",
    difficulty: "Easy",
    status: "Synced",
    languages: ["en", "cs", "de"],
    secretTip: false
  },
  {
    id: "pancir-summit",
    name: "Pancíř Summit",
    czName: "Vrchol Pancíř",
    category: "Hiking",
    description: "Rising to 1,214 meters, Pancíř is one of the most famous lookout peaks of the Šumava range. At the top, a traditional mountain cottage built in 1923 houses a wooden lookout tower offering stunning cross-border views directly to the Alps on clear days.",
    czDescription: "Pancíř, tyčící se do výšky 1 214 metrů, je jedním z nejznámějších vyhlídkových vrcholů Šumavy. Na vrcholu stojí tradiční horská chata z roku 1923 s dřevěnou rozhlednou nabízející úchvatné přeshraniční výhledy přímo na Alpy za jasných dnů.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHSf4LzcGuk_VUgCNLfGb2-zHPHn8aesLOSSqz4zbeEWIYyADfue4fJBy9QlR5UYznqbYenuRVRhJe0S7djj3R_AwPIZyOhgKZw-_61FABgonyrE38OVWkK26vfo0A07KFWLEUcJmsR0klNWOu0CCpO72IvTLfhIAZ6XdptR0sXEtnYOkQCMlOcHBirryIVXP-tKoZyjdULUYnglboPWUVUj2LjgZWIpsgEOWb1-zEG6cWDSNqgVtbqz41StBiSAhmyqaPUGh14nOM",
    elevationGain: "450 m",
    estTime: "3h 15m",
    distance: "8.2 km",
    lat: 49.1786,
    lng: 13.2561,
    stampName: "Pancíř Summit Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    difficulty: "Challenging",
    status: "Synced",
    languages: ["en", "cs"],
    secretTip: false
  },
  {
    id: "devils-lake",
    name: "Devil's Lake",
    czName: "Čertovo jezero",
    category: "Lakes",
    description: "The second-largest glacial lake in the Bohemian Forest, nested under the steep cliff face of Jezerní hora. According to a local legend, a devil drowned here with a stone tied to his tail, carved out the deep valley, and gave the lake its mystical name.",
    czDescription: "Druhé největší ledovcové jezero na Šumavě, hnízdící pod strmou skalní stěnou Jezerní hory. Podle místní legendy se zde utopil ďábel s kamenem uvázaným na ocase, vyryl hluboké údolí a dal jezeru jeho mystické jméno.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt4wJw8UYlq8Y4PLc3TRNZlHcgDNa0RaN_3HSDZMIFkmkXr_MC3Cee4M-uLVI9hUAwlKBXwnKcSc02Jx52SXcEHOU9ce8D7xgPZFf1IpTTsGYRe9zsgQ7wc_-NrbJ77rYXsVt_qn7nV0Q3Uwm1gZ-4_u95KxA387nMIo5INYrxhbL-4CYDW5gGmkohPVIZtGG4cAIYiWmT1twBUo7KS2vJ98PJKo-7ufq_h3uvdWiNQO7-O7R1JfXlO5tYVQA0179SHztrRAB6Y3V2",
    elevationGain: "280 m",
    estTime: "2h 15m",
    distance: "5.5 km",
    lat: 49.1654,
    lng: 13.1974,
    stampName: "Devil's Eye Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    difficulty: "Moderate",
    status: "Synced",
    languages: ["en", "cs"],
    secretTip: false
  },
  {
    id: "spicak-lookout",
    name: "Špičák Lookout",
    czName: "Rozhledna Špičák",
    category: "Hiking",
    description: "Located on the peak of Špičák Mountain (1,202 m), this modern 26-meter wooden observation tower offers unparalleled panoramic views of the cross-border Šumava-Bavarian Forest region, the valleys of Železná Ruda, and the distant peaks.",
    czDescription: "Nachází se na vrcholu hory Špičák (1 202 m), tato moderní 26metrová dřevěná rozhledna nabízí bezkonkurenční panoramatické výhledy na přeshraniční oblast Šumava-Bavorský les, údolí Železné Rudy a vzdálené vrcholky.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqpK2L_aNI_YCOer9HG1cJCjRldfFuy75aEjCExhaNEdif_peZ-yL5T2mwpZyEOLsK92FqR-WgjH0i0jAg4GuZ7d5yTI42QjbwK9Cc0_0migfzbFVlbnw53uCdzP4MhKinIMK7GnaqLW0PQmQXOLO9uDSaHKVtbguWeUZoVyuRMlXZTNj5AFOm8rjKFfNR2x1FXLv4JTBs2MFGJmQVZSKo0Fb-CenoAzH35khGsjIp6KpUMI8mFQlKnMFb86C2cNAKek0AwTK3eM_Z",
    elevationGain: "380 m",
    estTime: "2h 30m",
    distance: "6.0 km",
    lat: 49.1712,
    lng: 13.2215,
    stampName: "Špičák Crest Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    difficulty: "Moderate",
    status: "Synced",
    languages: ["en", "cs", "de"],
    secretTip: false
  },
  {
    id: "white-gorge-waterfall",
    name: "White Gorge Waterfall",
    czName: "Bílá strž",
    category: "Waterfalls",
    description: "The only natural waterfall in the Šumava National Park, where the Bílý potok creek drops 14 meters down a rugged, rocky mountain ravine. An elegant wooden observation deck hovers directly over the cascading water, surrounded by pristine old-growth mountain forest.",
    czDescription: "Jediný přirozený vodopád v Národním parku Šumava, kde Bílý potok padá 14 metrů dolů drsnou skalnatou horskou roklí. Elegantní dřevěná vyhlídková plošina se tyčí přímo nad kaskádovitou vodou, obklopena nedotčeným starým horským lesem.",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
    elevationGain: "190 m",
    estTime: "1h 45m",
    distance: "4.2 km",
    lat: 49.1932,
    lng: 13.1624,
    stampName: "White Gorge Cascade Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    difficulty: "Easy",
    status: "Synced",
    languages: ["en", "cs"],
    secretTip: false
  },
  {
    id: "klatovy-catacombs",
    name: "Klatovy Catacombs",
    czName: "Klatovské katakomby",
    category: "Museums",
    description: "A dark and fascinating crypt beneath the Jesuit Church of the Immaculate Conception of the Virgin Mary and St. Ignatius. Due to an ingenious natural ventilation system, the mummified bodies of 17th-century Jesuits and noblemen have been perfectly preserved here.",
    czDescription: "Temná a fascinující krypta pod jezuitským kostelem Neposkvrněného početí Panny Marie a sv. Ignáce. Díky důmyslnému systému přirozeného větrání se zde dokonale zachovala mumifikovaná těla jezuitů a šlechticů ze 17. století.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4SClF0eSKxyMgAQtmQVCYKqPnzGY96FL1a6NDKLRUVM5nyA2T_SCMuEWAe9r8TiVcp_2JVPjos1H1wYmX4Ha8BgWceoNthkCs-XmiwFL8vr4J2r_bX3pIw7kMZ0THFzcMPiJ2PgLzprHwbGLe7dBRPKh5DeUIfrM38Ulqcw2cny1_9RABKxmT6mukC2QCcfH3E6ur5Ffu9pc_PVQkt38995_p2hhJFU8r1w292u_7RnZmECH8fE3B12RBxYiq9fxmCBaq3CwrJy8c",
    elevationGain: "10 m",
    estTime: "1h 00m",
    distance: "0.8 km",
    lat: 49.3948,
    lng: 13.2925,
    stampName: "Crypt Key Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    difficulty: "Easy",
    status: "Synced",
    languages: ["en", "cs", "de"],
    secretTip: false
  },
  {
    id: "glass-ark",
    name: "Glass Ark",
    czName: "Skleněná archa",
    category: "Secret Tips",
    description: "An extraordinary collaborative art installation standing near the Bavarian-Czech border. It features a majestic green-glowing glass vessel shape held aloft by custom-carved wooden hands, representing hope, cross-border connection, and the preservation of wilderness.",
    czDescription: "Výjimečná společná umělecká instalace stojící poblíž bavorsko-české hranice. Představuje majestátní zeleně svítící skleněnou loď drženou vysoko na zakázku vyřezávanými dřevěnými rukama, reprezentující naději, přeshraniční spojení a zachování divočiny.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIUDuGLVfO3SHTls4pp-gHb3VbDvCTlV_0xwBwoM1VVS-e9DFDjb0u4hLEJyUcApxOe6u3Pc6hdyyS1d22tcp51QkfUhM-fb7KvC7hQuKxacvjUybDLSuO7ALoIb7mf7geNZSwA6Qh62yqDj4rQBgAPXmx-qP6OnC1YJvqjd8kmYNEFl6dCSVUy90q2eowqldrdiKipi43YF3-uTYkw2htAQ-JDcw6aJ_M2K43kb2nh2WnLI4dzFyaFO5ruhtb2MesicTi_hhr571q",
    elevationGain: "150 m",
    estTime: "2h 00m",
    distance: "5.0 km",
    lat: 49.0203,
    lng: 13.4352,
    stampName: "Glass Ark Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuArGvsjOhpYPv5fw2kq8DGRliU-6BabAUK_Bp9GQIp32q_o5q_hPmYHWUeBA11ewfXSAy7G_HiOnyMh68HfmGdHYhBmtY-GSREV9hOLB6YKcs6Lr-EJh3Fy5veuLR0sSPowDo7m4Mman3rTbFBX4pAI7vDHQxTTHAKETi5W0YQhbrGyW_uoESxGs-XMTT_ZG9EvZLTLNfgHwgA-yYrotfOUN5Js3O6qBXsxqy9qBwMkYIgnnYpPr-DgrtE8V1QoG4ol0EvG9dHnsYUc",
    difficulty: "Moderate",
    status: "Synced",
    languages: ["en", "cs", "de"],
    secretTip: true
  }
];

export const INITIAL_USER_STAMPS: UserStamp[] = [
  {
    id: "stamp-1",
    poiId: "black-lake",
    poiName: "Black Lake",
    stampName: "Green Lung Trail Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuArGvsjOhpYPv5fw2kq8DGRliU-6BabAUK_Bp9GQIp32q_o5q_hPmYHWUeBA11ewfXSAy7G_HiOnyMh68HfmGdHYhBmtY-GSREV9hOLB6YKcs6Lr-EJh3Fy5veuLR0sSPowDo7m4Mman3rTbFBX4pAI7vDHQxTTHAKETi5W0YQhbrGyW_uoESxGs-XMTT_ZG9EvZLTLNfgHwgA-yYrotfOUN5Js3O6qBXsxqy9qBwMkYIgnnYpPr-DgrtE8V1QoG4ol0EvG9dHnsYUc",
    collectedAt: "2026-06-15 14:32",
    latitude: 49.1794,
    longitude: 13.1822,
    unlocked: true
  },
  {
    id: "stamp-2",
    poiId: "klatovy-oldtown",
    poiName: "Klatovy Old Town",
    stampName: "White Tower Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2yrAupLtOjwq3W_mF1nm_hrMsrBuNZlHApu_UcM93eQQe3AYO8OBL4p1wtyyrmMARAxs00XaJC-cPKUoNZ_ocT1MH6oi8BB6U4ix2_pe-PLD6Kn3MU16lsCY8VjOIrQfA0JpzDh-GKgs6hcc7TTH6vyPFFYoMJA2oHI4QVCWFV0A9KsnrqGkeyVeTYWxFVj6bX4fxqgJBrwuAWulA639z3wDKj563-nOQL-Dp5Q4G20fivSUnbQ5LsW56FIIBnNPglYvS03X4Ut9d",
    collectedAt: "2026-06-20 10:15",
    latitude: 49.3955,
    longitude: 13.2952,
    unlocked: true
  },
  {
    id: "stamp-3",
    poiId: "glass-ark",
    poiName: "Glass Ark",
    stampName: "Glass Ark Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuArGvsjOhpYPv5fw2kq8DGRliU-6BabAUK_Bp9GQIp32q_o5q_hPmYHWUeBA11ewfXSAy7G_HiOnyMh68HfmGdHYhBmtY-GSREV9hOLB6YKcs6Lr-EJh3Fy5veuLR0sSPowDo7m4Mman3rTbFBX4pAI7vDHQxTTHAKETi5W0YQhbrGyW_uoESxGs-XMTT_ZG9EvZLTLNfgHwgA-yYrotfOUN5Js3O6qBXsxqy9qBwMkYIgnnYpPr-DgrtE8V1QoG4ol0EvG9dHnsYUc",
    collectedAt: "2026-06-25 16:45",
    latitude: 49.0203,
    longitude: 13.4352,
    unlocked: true
  },
  {
    id: "stamp-4",
    poiId: "pancir-summit",
    poiName: "Pancíř Summit",
    stampName: "Pancíř Summit Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    collectedAt: "",
    latitude: 49.1786,
    longitude: 13.2561,
    unlocked: false
  },
  {
    id: "stamp-5",
    poiId: "devils-lake",
    poiName: "Devil's Lake",
    stampName: "Devil's Eye Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    collectedAt: "",
    latitude: 49.1654,
    longitude: 13.1974,
    unlocked: false
  },
  {
    id: "stamp-6",
    poiId: "spicak-lookout",
    poiName: "Špičák Lookout",
    stampName: "Špičák Crest Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    collectedAt: "",
    latitude: 49.1712,
    longitude: 13.2215,
    unlocked: false
  },
  {
    id: "stamp-7",
    poiId: "white-gorge-waterfall",
    poiName: "White Gorge Waterfall",
    stampName: "White Gorge Cascade Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    collectedAt: "",
    latitude: 49.1932,
    longitude: 13.1624,
    unlocked: false
  },
  {
    id: "stamp-8",
    poiId: "klatovy-catacombs",
    poiName: "Klatovy Catacombs",
    stampName: "Crypt Key Stamp",
    stampImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJifHOR-SgHA0qKPdsDmi3i5ronfRkWeTKTtyHayBWpPccGsCIcQrzFe-uIa7-d70l2AesHoDZ_qhJ2pu5XVPSvRmRGfxVdoavME4C-tk1s6GXmwyDzIo-H6qgaZVhlsJGJbexMeR_hidxGrD3tXHo6PDlfQC3jIrr-1yZ37Vf2JHOfYycbRqgQFGyIgkXQL4S2prMmIGjVXZNRe7BzSfIUa6M_Zw8yNNZ0F9j_NYoTazdXlU5PyItHhdjlObRAy2D-GjO4Su2ppaE",
    collectedAt: "",
    latitude: 49.3948,
    longitude: 13.2925,
    unlocked: false
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "Nature Lover",
    description: "Scan 3 forest or lake digital stamps in the Šumava region.",
    unlocked: true,
    unlockedAt: "2026-06-25 16:45",
    icon: "Compass"
  },
  {
    id: "ach-2",
    title: "Early Bird",
    description: "Scan any location digital stamp before 08:00 AM.",
    unlocked: false,
    icon: "Sunrise"
  },
  {
    id: "ach-3",
    title: "Trailblazer",
    description: "Complete a route with elevation gain above 300 meters.",
    unlocked: true,
    unlockedAt: "2026-06-15 14:32",
    icon: "TrendingUp"
  },
  {
    id: "ach-4",
    title: "Cross-Border Explorer",
    description: "Scan stamps in both Czech Republic and German Border zones.",
    unlocked: false,
    icon: "Globe"
  }
];

export const INITIAL_API_LOGS: ApiLog[] = [
  {
    id: "log-1",
    timestamp: "2026-06-30 08:15:23",
    endpoint: "bayerncloud.api/sync/region/sumava",
    method: "GET",
    status: 200,
    latency: 142,
    message: "Successfully synchronized 12 points of interest inside the active region. Updated 1 description."
  },
  {
    id: "log-2",
    timestamp: "2026-06-30 09:20:11",
    endpoint: "bayerncloud.api/stamps/upload",
    method: "POST",
    status: 200,
    latency: 210,
    message: "Uploaded 3 new stamp collections to BayernCloud digital ledger."
  },
  {
    id: "log-3",
    timestamp: "2026-06-30 11:45:02",
    endpoint: "bayerncloud.api/sync/zone/active-status",
    method: "GET",
    status: 200,
    latency: 98,
    message: "Connection alive. BayernCloud region synchronizer is healthy and active."
  },
  {
    id: "log-4",
    timestamp: "2026-06-30 13:02:18",
    endpoint: "bayerncloud.api/pois/black-lake/languages",
    method: "PUT",
    status: 200,
    latency: 185,
    message: "Pushed German localization updates for 'Black Lake' successfully."
  }
];
