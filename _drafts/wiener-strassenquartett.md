---
title: "Wiener Straßenquartett"
tags: [daten, verkehr]
---

Am Gürtel an der Ampel stehen.
Vorbeirauschende Autos.
Wo fahrts ihr alle hin?
In die flüchtigen Gesichter hinterm Steuer schauen.
Sie geben keinen Aufschluss.

Wie viele Leute rollen da eigentlich so herum den ganzen Tag?
Die Magistratsabteilung 46 (für Verkehrsorganisation und technische Verkehrsangelegenheiten) erfasst das ziemlich feingranular.
Für 71 [Zählstellen](https://www.data.gv.at/katalog/dataset/3d66f423-def8-467e-af82-2fa98146b967) monatliche [Zählwerte](https://www.data.gv.at/katalog/dataset/4707e82a-154f-48b2-864c-89fffc6334e1) bestehend unter anderem aus:

- DTVMS (Durchschnittlicher täglicher Verkehr Montag - Sonntag)
- DTVMF (Montag - Freitag)
- ...
- DTVSF (Sonn- und Feiertage)
- TVMAXT (Maximaler Tagesverkehr aller Tage)

Und das jeweils pro:

- Fahrzeugtyp (Kfz / Lkw-ähnlich)
- Richtung (Hin / Zurück / Gesamt)

Das könnt man toll visualisieren, temporale Entwicklungen und räumliche Unterschiede aufzeigen.
Oder ein Quartett basteln.
Das _Wiener Straßenquartett_, Tada!

Keine effiziente Visualisierung, schon klar.
Aber leiwand ists durch so ein Packerl Karten zu blättern.
Welches ist denn jetzt das längste U-Boot, der schwerste Jumbojet, der Monstertruck mit dem größten Hubraum?

Oder ... die ärgste Verkehrshölle in Wien?

Viel Spaß beim Durchblättern!

<iframe src="{{ site.baseurl }}/data-visualization/wiener-strassenquartett" width="100%" height="600px" style="border:none;"></iframe>

[Vollbildversion]({{ site.baseurl }}/data-visualization/wiener-strassenquartett){:target="\_blank"}

[Repository](https://github.com/elias-gander/WienerStrassenquartett){:target="\_blank"}

Und so wurds gemacht:

<iframe src="{{ site.baseurl }}/data-visualization/wiener-strassenquartett/notebook.html" width="100%" height="600px" style="border:none;"></iframe>
