---
title: "Wiener Straßenbäume"
tags: [daten, begruenung]
---

Gut 226.000 Bäume in Wien, so der Wiener [Baumkataster](https://www.data.gv.at/katalog/de/dataset/stadt-wien_baumkatasterderstadtwien).
Ziemlich sicher nur ein Bruchteil - Bäume in Innenhöfen, Parks und Waldflächen sind nur teilweise erfasst.
Straßenbäume, so die Magistratsabteilung 42, finden sich aber alle im Datensatz.

200.000 Bäume, sind das genug?
Wenn ich hier durch die gürtelnahen Grätzel des 16., 17. und 18. spazier: nein.

Das Rathaus sagt:

> 50 Prozent der Fläche Wiens sind Grünflächen. Das ist ein internationaler Spitzenwert.[^1]

Cool, nur blöd, dass der größte Teil davon am Stadtrand liegt.
Wie schauts im dicht bebauten Stadtgebiet aus?
Oder noch mehr: auf den Straßen?

Der Baumkataster liefert für die allermeisten Bäume den ungefähren Kronendurchmesser, der Wiener [Straßengraph](https://www.data.gv.at/katalog/en/dataset/stadt-wien_straengraphwien) die Straßenflächen[^2].
Entfernt man jene Bäume, deren Kronenfläche sich nicht mit einer Straßenfläche überschneiden, bleiben noch gut 91.000 Bäume.
Immerhin.

Und wo stehen die?
91.000 Bäume als grüne Heatmap malen.
Darüber, als Maske, die invertierten Straßenflächen legen.
Übrig bleibt das grau-grün gefärbte Wiener Straßennetz.

Die gürtelnahen Grätzel im 16., 17. und 18. grau in grau.
Nur wenig weiter nördlich, das tiefgrüne Cottageviertel.

Viel Freude beim Explorieren!

_Tipp: Auch mal weiter reinzoomen und Bäume anklicken._

<iframe src="{{ site.baseurl }}/data-visualization/wiener-strassenbaeume" width="100%" height="600px" style="border:none;"></iframe>

[Vollbildversion]({{ site.baseurl }}/data-visualization/wiener-strassenquartett){:target="\_blank"}

## Nitty gritty

Straßenbaumdichte: niedrig / hoch - sehr hilfreich!
Für alle, die es etwas genauer verstehen wollen:

- Jeder Baum ist linear mit seinem Kronendurchmesser gewichtet. Heißt: Ein Baum mit 10 m Kronendurchmesser trägt nur halb so viel zur Farbintensität (also der _density_ am jeweiligen Punkt) bei.
- Jeder Baum hat einen Einflussbereich von 100 m Radius **am höchsten Zoomlevel** (an dem die Heatmap noch sichtbar ist). Am niedrigsten Zoomlevel sinds 300 m. Also je weiter rausgezoomt, desto glatter die Heatmap.
- Um den wachsenden Einflussbereich mit abnehmendem Zoomlevel auszugleichen, sinkt die Gesamtintensität der Heatmap bei niedrigstem Zoomlevel auf ein Drittel der Intensität bei höchstem Zoomlevel.

Wie komme ich auf diese Werte?
Trial and error.

Alles weitere im:

[Repository](https://github.com/elias-gander/WienerStrassenbaeume){:target="\_blank"} und Jupyter Notebook:

<iframe src="{{ site.baseurl }}/data-visualization/wiener-strassenbaeume/notebook.html" width="100%" height="600px" style="border:none;"></iframe>

---

{: data-content=" Fußnoten "}

[^1]: [Öffentlich zugängliche Grünflächen - Analyse](https://www.wien.gv.at/umweltschutz/umweltgut/oeffentlich.html)
[^2]: Der Datensatz ist ein Graph aus Straßenlinien und -knoten. Die Straßenbreite ist leider nur für gut die Hälfte der Abschnitte vorhanden. Für alle anderen nehme ich den Median der vorhandenen Straßenbreiten.
