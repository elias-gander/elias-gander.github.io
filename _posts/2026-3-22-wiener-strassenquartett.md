---
title: "Wiener Straßenquartett"
tags: [Daten, Verkehr]
image: "/media/wiener-strassenquartett/screenshot.png"
---

Währinger Gürtel, warten auf das grüne Maxerl.
Vorbeirauschende Autos.
Wo fahrts ihr alle hin?
Die flüchtigen Gesichter hinterm Steuer geben keinen Aufschluss.

Wie viele Leute rollen hier eigentlich vorbei den ganzen Tag?
Die Magistratsabteilung 46 für Verkehrsorganisation und technische Verkehrsangelegenheiten erfasst das ziemlich feingranular.
Für 71 über die Stadt verstreute [Zählstellen](https://www.data.gv.at/katalog/dataset/3d66f423-def8-467e-af82-2fa98146b967) monatliche [Zählwerte](https://www.data.gv.at/katalog/dataset/4707e82a-154f-48b2-864c-89fffc6334e1) bestehend unter anderem aus:

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
Das _Wiener Straßenquartett_, tadaa!

Keine effiziente Visualisierung, schon klar.
Aber schon leiwand durch ein Packerl Karten zu blättern:
Das längste U-Boot, der schwerste Jumbojet, der Monstertruck mit dem größten Hubraum?

Oder ... die ärgste Verkehrshölle in Wien?

<iframe src="{{ site.baseurl }}/data-visualization/wiener-strassenquartett" width="100%" height="600px" style="border:none;"></iframe>

[Vollbildversion]({{ site.baseurl }}/data-visualization/wiener-strassenquartett){:target="\_blank"}

[Repository](https://github.com/elias-gander/wiener-strassenquartett){:target="\_blank"}

Datenaufbereitung im [Jupyter Notebook](https://github.com/elias-gander/wiener-strassenquartett/blob/bd80878a4236d26e3b16b2432a451acdf6a33a06/notebook.ipynb):

<iframe src="{{ site.baseurl }}/data-visualization/wiener-strassenquartett/notebook.html" width="100%" height="600px" style="border:none;"></iframe>
