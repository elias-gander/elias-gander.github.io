---
title: "Wiener Parkplätze"
tags: [Daten, Verkehr]
---

Die Bergsteiggasse in Hernals.
Ich stehe am Fenster, schaue runter in die Gasse.
Entlang der gegenüberliegenden Hausmauer, ein Gehsteig.
Davor reihen sich der Länge nach Autos: weiß und korpulent, rot und kompakt, schwarz und langgestreckt.

Es gibt in unserer Gasse keinen Baum.
Auch keinen Strauch.
Eigentlich nicht mal einen Grashalm.

Parkplätze gibt's einige.
Man könnte sagen viele.
Hundert und zweiundzwanzig.
Aber die Bergsteiggasse ist ja auch recht lang.
650 Meter von der Ottakringer Straße bis zur Blumengasse.

Nicht auf jedem Parkplatz steht ein Auto.
Manche sind einfach leer.
Sie warten, stehen zur Verfügung.
Zu Fuß durch die Parklücke noch vor der roten Ampel über die Straße huschen.
Am Fahrrad in der Parklücke halten, aufs Navi schauen.

Die längerfristige Nutzung schwierig.
Der Parkplatz wartet, will stets bereit sein für das Auto.
Mich kann man weghupen, einen Baum nicht.

Wie viele Parkplätze gibt's in Wien?
Ganz genau wird's nicht stimmen, aber ich komme auf **241.468**.

Du willst wahrscheinlich wissen, wie ich gezählt habe.

## Datenbasis

> Die Flächen-Mehrzweckkarte ist die digitale Stadtkarte von Wien in einer flächigen Darstellungsform. Aufbauend auf der Mehrzweckkarte zeigt die Flächen-Mehrzweckkarte die kleinräumige Bodennutzung für das gesamte Wiener Stadtgebiet.

So beschreibt die Magistratsabteilung für Stadtvermessung (MA 41) ihre Flächen-Mehrzweckkarte (FMZK).
Die FMZK steht zur [freien Verfügung](https://www.data.gv.at/katalog/dataset/7cf0da04-1f77-4321-929e-78172c74aa0b){:target="\_blank"} und definiert, neben vielen anderen Dingen, welche Flächen für den _ruhenden Verkehr_ vorgesehen sind.

Laut Auskunft ermittelt die MA 41 diese Flächen auf Basis des [Orthofotos](https://www.data.gv.at/katalog/dataset/orthofoto-2023-wien){:target="\_blank"}, also den dort sichtbaren Kfz und Straßenmarkierungen.
Keine perfekte Datenbasis, denn manche der Flächen sind gar keine Parkplätze:

- Ladezonen
- In Vergangenheit auch: Fahrradabstellanlagen.  
  Inzwischen entfernt die MA 41 sie wieder aus der FMZK. Einige können aber trotzdem drinnen sein, die Bereinigung ist noch im Gange.

Andererseits scheinen nicht straßenmarkierte Parkflächen in Siedlungsstraßen mit der erforderlichen Mindestbreite in der FMZK nicht auf.

Hält sich das die Waage?
Keine Ahnung.

Trotz allem bezeichne ich der Einfachheit halber die Flächen für den ruhenden Verkehr in der FMZK ab jetzt als **Parkflächen**.

Die FMZK speichert Parkflächen als Koordinaten von Polygonen.
Eine Parkfläche umfasst meistens mehrere Parkplätze.
Die Parkflächen-Polygone haben verschiedenste Formen:

| Straßensituation                                         | Parkflächen-Polygon                       |
| -------------------------------------------------------- | ----------------------------------------- |
| Parallelparken entlang gerader Gasse                     | Rechteck                                  |
| Schrägparken entlang gerader Gasse                       | Parallelogramm                            |
| Durch Baumscheiben oder Beete getrennte Parkplätze       | Polygon mit Löchern und/oder Ausschnitten |
| Parkplätze entlang von Kurven                            | Gekrümmtes Polygon                        |
| Direkt aneinanderliegende Schräg- und Parallelparkplätze | Verbundenes Rechteck und Parallelogram    |

Die FMZK enthält **63.434** solcher Gebilde.
Wie viele Parkplätze passen da rein?

## Parkplätze zählen

Der Ansatz in aller Kürze:

1. FMZK auf Parkflächen reduzieren
2. Für jedes Parkflächen-Polygon:
   1. Das größtmögliche Rechteck das ins Polygon passt (_largest interior rectangle_, kurz LIR) berechnen.
   2. LIR speichern und vom Originalpolygon abschneiden
   3. Wieder das LIR für das Restpolygon berechnen. Diesen Prozess so lange wiederholen bis das gefundene LIR kleiner ist als ein einzelner Parkplatz.
3. Alle gefundenen LIRs der Länge nach in einzelne Parkplätze aufteilen.
4. Das Wiener Stadtgebiet in ein Raster mit 500 Meter weiten Zellen unterteilen und jeden Parkplatz basierend auf seinem Mittelpunkt einer Zelle zuweisen
5. Die Parkplätze jeder Zelle als GeoJSON Datei abspeichern.

_Warum LIRs?_  
Beliebige Polygone der Länge nach in gleichmäßige Stücke zu unterteilen ist schwer.
Für Rechtecke ist das trivial.  
Der LIR-Ansatz ist robust auch bei durchlöcherten und besonders unregelmäßigen Polygonen.

_Wie groß ist ein Parkplatz?_  
Mindestens sechs mal zwei Meter.
Eigentlich sind Parkplätze etwas breiter als zwei Meter, aber im Falle eines gekrümmten Parkflächen-Polygons sind die LIRs stets schmäler als das Polygon - deshalb etwas Toleranz.

_Warum GeoJSON?_  
Weil die Parkplätze auf einer interaktiven Karte im Browser dargestellt werden und Javascript gut mit GeoJSON kann.

_Warum die Parkplätze auf viele kleine GeoJSONs verteilen?_  
258.205 Parkplätze mit je vier Koordinaten aus Längen- und Breitengrad macht gut zwei Millionen Gleitkommazahlen.
Nicht jede:r möchte erst mal 80 MB herunterladen nur um eine Karte mit ein paar Parkplätzen zu sehen.

Alle weiteren Details im [Jupyter Notebook](https://github.com/elias-gander/WienerParkplaetze/blob/38d9613a7ae774b55bd0c14f0e47aafc00f07c48/wiener_parkplaetze.ipynb){:target="\_blank"}:

<iframe src="{{ site.baseurl }}/data-visualization/wiener-parkplaetze/notebook.html" width="100%" height="600px" style="border:none;"></iframe>

## Visualisierung

Eine graue Stadt, viele bunte Autos.

Tausende Elemente auf einer interaktiven Karte darstellen?
Ein Fall für _WebGL_, [eindeutig](http://kuanbutts.com/2019/08/31/mbgl-vs-leaflet/){:target="\_blank"}.
_Maplibre GL JS_ kann das.
Das Open-Source Projekt ist ein Fork des Platzhirschen _Mapbox GL JS_, der Ende 2020 auf eine proprietäre Lizenz wechselte.

Die wunderschönen bunten Autos gibt's [hier](https://opengameart.org/content/isometric-vehicles){:target="\_blank"}.
Zwölf Modelle in je zwölf Farben und je sechzehn Perspektiven (in 22.5° Schritten) - macht 2304 PNGs und 17 MB an Assets.
Das ist etwas arg viel, deswegen [split_and_sample.py](https://github.com/elias-gander/WienerParkplaetze/blob/main/web/assets/vehicles/split_and_sample.py){:target="\_blank"}.

Das PNG mit der passendsten Perspektive wird während der Datenaufbereitung bestimmt.
Um die LIRs in einzelne Parkplätze aufzuteilen, werden diese mit ihrer längsten Seite parallel zur x-Achse ausgerichtet:

```
def split_parkflaeche(poly, min_parallel=6, min_perp=3):
   ...
   def dist(a, b):
      return math.hypot(b[0]-a[0], b[1]-a[1])
   d0 = dist(coords[0], coords[1])
   d1 = dist(coords[1], coords[2])
   if d0 >= d1:
      dx = coords[1][0] - coords[0][0]
      dy = coords[1][1] - coords[0][1]
   else:
      dx = coords[2][0] - coords[1][0]
      dy = coords[2][1] - coords[1][1]
   theta = math.degrees(math.atan2(dy, dx))
   cen = poly.centroid
   poly_rot = affinity.rotate(poly, -theta, origin=cen)
```

Die einzelnen Parkplätze werden dann um den Schwerpunkt des LIR in ihre ursprüngliche Ausrichtung zurückrotiert.
**theta** liegt im Bereich von [180, -180]° und wird zusammen mit jedem Parkplatz gespeichert.
Handelt es sich um einen Schrägparkplatz, müssen zusätzliche 90° abgezogen werden.
Wie bringt man **theta** auf die näheste der verfügbaren Auto-Perspektiven: [0, 22.5, 45, ..., 337.5]?

```
rotations = np.arange(0, 359, 22.5)
parkplaetze["rotation"] = parkplaetze["rotation"].apply(lambda degrees: round(rotations[np.abs(rotations - ((degrees + 360) % 360)).argmin()]))
```

Et voilà.

Wie viele Parkplätze gibt's in eurer Gasse?

<iframe src="{{ site.baseurl }}/data-visualization/wiener-parkplaetze" width="100%" height="600px" style="border:none;"></iframe>

[Vollbildversion]({{ site.baseurl }}/data-visualization/wiener-parkplaetze){:target="\_blank"}

[Repository](https://github.com/elias-gander/WienerParkplaetze){:target="\_blank"}
