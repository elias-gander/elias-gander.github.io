---
title: "Wie steil sind Wiens Radstrecken?"
tags: [Daten, Fahrrad]
---

Bergauf radln ist anstrengend:

{% assign iframe_src = site.baseurl | append: "/data-visualization/wie-steil-sind-wiens-radstrecken/rechner" %}
{% include iframe-with-dynamic-height.html iframe_src=iframe_src %}

Den Exelberg hochschwitzen und dann die Serpentinen runterfetzen?
Ja!  
Bei Abgasduft und Motorlärm den Mariahilfergürtel hoch?
Nein danke.

Jede:r hat sie, die persönlichen Hass-Rampen die es immer wieder hoch geht.  
Meine:

- Getreidemarkt
- Vom Margaretengürtel zum Westbahnhof
- Von der U6 Alser Straße zum AKH

Wie steil sind diese Strecken eigentlich?

Die Karte drunter zeigt: auf allen drei bleibt die Steigung gut unter 4 %.
Halb so wild, es nerven wohl eher Lärm und Abgase.

Wien ist nicht zu steil zum Radln!

(Mal abgesehen von der Gallitzinstraße - abschnittsweise Steigungen bis 16%!)

<iframe src="{{ site.baseurl }}/data-visualization/wie-steil-sind-wiens-radstrecken" width="100%" height="600px" style="border:none;"></iframe>

[Vollbildversion]({{ site.baseurl }}/data-visualization/wie-steil-sind-wiens-radstrecken){:target="\_blank"}

Datenbasis ist diesmal das Wiener [Hauptradverkehrsnetz](https://www.data.gv.at/datasets/1ea3d3e8-fa07-4c37-af68-eb588d439de2) und das [Geländemodell als Schichtenlinien](https://www.data.gv.at/datasets/e45374c0-3e40-434c-92dc-203492ccee49) der Magistratsabteilung für Stadtvermessung - MA 41.

Höhenlinien in 1-Meter Abständen und respektable Genauigkeit:

> In den Gebieten, in welchen das digitale Geländemodell zum überwiegenden Teil auf den Daten der Mehrzweckkarte basiert, beträgt die Höhengenauigkeit im Straßenraum plus/minus 10 Zentimeter und im Blockinnenbereich plus/minus 25 Zentimeter. In bewaldeten Bereichen, wo das digitale Geländemodell aus Laserscandaten abgeleitet wurde, beträgt die Höhengenauigkeit im flachen Gelände plus/minus 20 Zentimeter und im steilen Gelände plus/minus 1 Meter.[^1]

Der Ansatz ausführlich dokumentiert im Jupyter Notebook:

<iframe src="{{ site.baseurl }}/data-visualization/wie-steil-sind-wiens-radstrecken/notebook.html" width="100%" height="600px" style="border:none;"></iframe>

Alles Weitere im [Repository](https://github.com/elias-gander/WieSteilSindWiensRadstrecken){:target="\_blank"}

---

{: data-content=" Fußnoten "}

[^1]: [Geländemodell Produktinformation](https://www.wien.gv.at/stadtentwicklung/stadtvermessung/geodaten/dgm/produkt.html)
