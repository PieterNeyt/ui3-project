# < SmartNest >

## 💡 Uitdagingen & Prestaties

###  Belangrijkste uitdagingen
Tijdens de ontwikkeling heb ik vooral moeite gehad met **state management**. Het synchroniseren van de status van meerdere domotica-controls tussen de frontend en backend.  
In het begin liepen de statussen soms uit sync door vertragingen of gelijktijdige updates.  
Uiteindelijk heb ik dit probleem kunnen oplossen door **polling** te implementeren, waardoor de frontend op vaste intervallen de data van de backend ophaalt en de weergave altijd up-to-date blijft.

###  Waar ik het meest trots op ben
Het onderdeel waar ik het meest trots op ben, is de **logging view**.  
Hierin worden alle wijzigingen aan controls overzichtelijk weergegeven, gecombineerd met wat leuke grafieken zoals:
- de meest geschakelde lampen
- de kamers met de meeste interacties met domotica-controls


---

## ✅ Afgewerkte Functionaliteiten

Lijst van alle functies die met succes zijn geïmplementeerd en getest.

Voorbeeld:
- [x] [US1] Als admin wil ik verdiepingen beheren (CRUD) om een gebouw met meerdere verdiepingen te structureren.
- [x] [US2] Als admin wil ik kamers beheren (CRUD) om een grondplan (bovenaanzicht) per verdieping aan te maken.
- [x] [US3] Domotica controls beheren (CRUD) zodat deze beschikbaar zijn voor gebruikers.
- [x] [US4] Globale scenes beheren (CRUD) zodat deze toegankelijk zijn voor alle gebruikers
- [x] [US5] Tijdsloten koppelen aan scènes (CRUD) zodat deze periodiek actief worden
- [x] [US6] Domotica controls zoeken, filteren, bekijken en aanpassen
- [x] [US7] Index (CRUD) beheren om eenvoudig eigen voorkeuren in te stellen
- [x] [US8] Index activeren en deactiveren om onmiddellijk een bepaalde situatie of sfeer te bekomen
- [x] [US9] De interface in dark/light/system modus zetten (system volgt het dark/light schema van het systeem van de gebruiker)
- [x] [US10] Een logging view met data die de wijzigingen aan controls bevat in verschillende views oa. een grafiek view en wat interessante data (meest geschakelde lampen, temperatuurverloop over de tijd)


---

## ❌ Onvoltooide / Geplande Functionaliteiten

Zaken die gepland zijn, in ontwikkeling zijn of nog niet zijn geïmplementeerd.

Voorbeeld:
