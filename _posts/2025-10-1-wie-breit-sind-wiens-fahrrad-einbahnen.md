---
title: "Wie breit sind Wiens Fahrrad-Einbahnen?"
tags: [Daten, Fahrrad]
---

Am 6. Juli 2022 beschließt die damalige Bundesregierung die 33. StVO-Novelle.
Der ursprüngliche Entwurf von Leonore Gewessler sieht eine automatische Öffnung von Einbahnen für Radler:innen vor, wenn die Einbahn 1) ohne Parkplätze mindestens vier Meter breit ist und 2) maximal Tempo 30 gilt.
Natürlich ist auch eine Nicht-Öffnung bei behördlicher Begründung vorgesehen.
Die automatische Einbahnöffnung schafft es trotzdem nicht ins finale Gesetz, vor allem aufgrund von Einwänden durch die Stadt Wien: Eine Überprüfung von 425 km nicht geöffneter Einbahnen sei kurzfristig nicht möglich.[^1]

Wien hat viele Einbahnen für Radfahrende geöffnet und doch könnten es wahrscheinlich noch mehr sein.
Offene Einbahnen bedeuten kürzere und, wenn es sich manchmal auch nicht so anfühlen mag, sicherere Wege.
Aus dem gleichen Grund warum sich Zufußgehende an die linke Straßenseite halten sollen ist auch das Radfahren gegen die Einbahn besonders sicher: es besteht Blickkontakt zu den Autofahrenden.
Beim Radeln kommt dazu noch der Blickkontakt zu den Menschen in geparkten Autos - Stichwort _Dooring_.

Welche Einbahnen sollten also noch geöffnet werden?
Intuitiv: alle, in denen ein Kfz und ein Fahrrad bequem nebeneinander passen.  
Und wie breit ist das? Der Gewessler-Entwurf betrachtet vier Meter (befahrbare!) Fahrbahnfläche als generell ausreichend. Die deutsche Forschungsgesellschaft für Straßen- und Verkehrswesen (FGSV) empfiehlt lediglich bei stärkerem Bus- oder Lkw-Verkehr eine Mindestbreite von 3,5 Metern - je nach Verkehrsaufkommen können auch deutlich engere Einbahnen geöffnet werden.

Neben der Fahrbahnbreite spielt natürlich auch die Geschwindigkeit eine Rolle.
50 km/h schnellen Kfz möchte ich nicht entgegenradeln und auch die FGSV sieht das so: Einbahnöffnung nur bei Tempolimit 30 km/h.

Schließlich noch eine Vielzahl lokaler Faktoren die eine Einbahnöffnung unmöglich machen.
So etwa die Stellungnahme der Magistratsabteilung für Verkehrsorganisation und technische Verkehrsangelegenheiten MA 46 zu meiner Anfrage betreffend der Öffnung eines durchgängig mindestens vier Meter breiten Abschnitts der Bergsteiggasse:

> Im Zuge der Errichtung des Radfahrens gegen die Einbahn sind nicht nur bestehende Fahrbahnbreiten oder Ausweichstellen zur Entscheidungsfindung zu berücksichtigen, sondern auch die Häufigkeit von möglichen Begegnungsfällen auf Grund der vorhandenen Fahrzeugfrequenzen, die Berücksichtigung der Erschließungsfunktion sowie den erwartenden Fahrzeugtypen (PKW, LKW).
> Eine Umgestaltung des Bereichs erfordert eine Projektierung durch den Straßenerhalter und liegt im überwiegenden Interesse des Bezirks.  
> Anzumerken ist, dass bei einer möglichen Realisierung des Vorhabens die bestehende VLSA (Verkehrslichtsignalanlage) im Bereich der Ottakringer Straße # Bergsteiggasse adaptiert werden müsste. Eine zusätzliche Phase wäre für den Radverkehr notwendig. Dadurch würde es zu Verzögerungen bei den Straßenbahn-Intervalle der Wiener Linien kommen.
> In der Steinergasse und Teile der Geblergasse wurde das Radfahren gegen die Einbahn realisiert.
> Hierbei kam es zu einem Lückenschluss der bestehenden Radfahranlagen zwischen dem 16. und 17. Bezirk.
> Eine Abänderung der Verkehrssituation ist derzeit nicht vorgesehen.  
> Seitens der Abteilung für Verkehrsorganisation und technische Verkehrsangelegenheiten sind zum gegenwärtigen Zeitpunkt keine weiteren Maßnahmen erforderlich.

Warum am Ende einer geöffneten Einbahn unbedingt eine Fahrradampel notwendig sein sollte erschließt sich mir nicht, aber das führt jetzt zu weit und auch weg vom eigentlichen Thema: der Breite.
Sie ist also nicht allein ausschlaggebend aber doch einer der wichtigsten Faktoren wenn es um die Einbahnöffnung geht.

Anstatt mit dem Maßband auf die Straße zu treten - wie die Wiener Einbahnen algorithmisch vermessen?
Dazu genügen zwei Datensets:

- [GIP-Verkehrsgraph](https://www.data.gv.at/datasets/3fefc838-791d-4dde-975b-a4131a54e7c5) für die Geometrie der passenden Einbahnen
- [Flächen-Mehrzweckkarte (FMZK)](https://www.data.gv.at/datasets/7cf0da04-1f77-4321-929e-78172c74aa0b) für die Geometrie der Fahrbahnflächen

Mit diesen Daten der folgender Ansatz in aller Kürze:

1. Einbahnen im 1-Meter-Abstand abschreiten
2. durch jeden sich ergebenden Punkt eine ausreichend lange, zur Einbahn senkrechte Linie ziehen
3. jede senkrechte Linie mit der lokalen Fahrbahnfläche überschneiden
4. das sich überschneidende Liniensegment abmessen
5. die Mindestbreite einer Einbahn ist die Länge des kürzesten, zur Einbahn senkrechten Liniensegments

Einmal laufen lassen für alle Tempo-30-Einbahnen in Wien.
Zusätzlich zur Mindestbreite noch die Medianbreite (Medianlänge aller senkrechten Liniensegmente) berechnen und voilà:

{% include image.html path="media/wie-breit-sind-wiens-fahrrad-einbahnen/histogramme.png" link="media/wie-breit-sind-wiens-fahrrad-einbahnen/histogramme.png" %}

Nicht geöffnete Einbahnen sind tendenziell schmäler als die geöffneten.
Aber auch sehr viele grundsätzlich ausreichend breite Einbahnen sind nicht geöffnet!

Der Ansatz funktioniert wahrscheinlich für die meisten Straßen ordentlich.
Auf so stark aggregierte Erkenntnisse würde ich mich aber nicht stützen:

- die Datenqualität der FMZK ist durchwachsen (z.B. fehlen in Siedlungsstraßen die Parkflächen)
- befahrbare und nicht befahrbare Schienenflächen in der FMZK sind schwer zu unterscheiden
- Einbahn-Linien aus dem GIP sind eher grob und verlassen an engen Kurven oder Kreuzungen oft die Fahrbahnflächen
- für viele Einbahnen fehlt das Tempolimit, diese sind nicht berücksichtigt
- ...

Viel hilfreicher ist da eine Kartenansicht: Welche Einbahnen würdest du gern öffnen?

<iframe src="{{ site.baseurl }}/data-visualization/wie-breit-sind-wiens-fahrrad-einbahnen" width="100%" height="600px" style="border:none;"></iframe>

[Vollbildversion]({{ site.baseurl }}/data-visualization/wie-breit-sind-wiens-fahrrad-einbahnen){:target="\_blank"}

Ausführlichere technische Dokumentation im [Jupyter Notebook](https://github.com/elias-gander/wie-breit-sind-wiens-fahrrad-einbahnen/blob/60308f31b169c017336d9bc315f42a1095d62a4f/notebook.ipynb){:target="\_blank"}:

<iframe src="{{ site.baseurl }}/data-visualization/wie-breit-sind-wiens-fahrrad-einbahnen/notebook.html" width="100%" height="600px" style="border:none;"></iframe>

Alles Weitere im [Repository](https://github.com/elias-gander/wie-breit-sind-wiens-fahrrad-einbahnen){:target="\_blank"}

---

[^1]: [ORF-Artikel - StVO-Novelle: Wien wehrt sich gegen Kritik](https://wien.orf.at/stories/3160808/){:target="\_blank"}
