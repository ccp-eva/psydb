# Leitfaden

## Allgemeiner Ablauf

Nach der Grund-Initialisierung gibt es einen Admin-Nutzeraccount mit dem das Initiale Setup durchgeführt werden kann.
Zunächst soll hier ein kurabriss des allgemeinen Ablaufs mit einfachen fiktiven Werten gegeben werden.

### Grundsätzliche Begriffsklärung
    
1. **Hilfstabellen (Helper-Set)**\
    Hilfstabellen sind benutzerdefinierte Tabellen mit einfachen Einträgen
    die es nur erfordern, dass eine Bezeichnung hinterlegt werden soll aber keine weiteren
    attribute. Dies ist zum Beispiel sinnvoll um Novels oder Sprachen abzubilden.
    
2. **Statische Haupttabellen**\
    Es gibt folgende statische Haupttabelle: Forschungsgruppen, Mitarbeiter, Systemrollen, Themengebiete.
    Die Felder von Datensätzen dieser Tabellen (d.h. Felder von Einträgen) sind vollständig vom System
    definiert, sie können nicht weiter konfiguriert werden. Sie haben keine benutzerdefinierten Datensatz-Typen.
    
3. **Dynamische Haupttabellen (Collections)**\
    Es folgende dynamische Haupttabellen: Probanden, Locations, Studien Externe Personen und Externe Organisationen.
    Diese unterstützen jeweils eigene benutzerdefinierte Datenssatz-Typen (d.h. Untertypen der Haupttabelle).
    Innerhalb der Haupttabelle 'Probanden' kann z.B. der Datensatz-Typ 'Mäuse' angelegt werden.
    Die Datensatz-Typen können mit beliebig vielen benutzerdefinierten Feldern konfiguriert werden.

4. **Datensätze**\
    Datensätze sind jeweils die Einträge in einer Tabelle (sowohl Hilfs- als auch Huapttabellen)
    Die Datensätze von Hilfstabellen haben nur ein einzelnes Feld für eine Bezeichnung.
    Bei Datensätzen statischer Haupttabellen sind die Felder vollständig vom System definiert.
    Bei Datensätzen dynamischer Haupttabellen gibt es einen Anteil von Feldern, der vom System definiert ist, und einen Teil der vom Nutzer konfiguiert wird.
    Beispielsweise ist bei Probandentypen das Attribut zum einstellen derTeilnahmeerlaubnis immer vorhanden. Felder wie Name, oder Geburtsdatum müssen aber
    erst konfiguriert werden. (Hinweis: Datensätze dynamischer Haupttabellen enhalten immer das Feld 'Kommentar', dieses gehört zum statischen Anteil)


### Anlegen von Forschungsgruppen
Bei Start sind keine Forschungsgruppen vorhanden.
Es muss mindestens eine Forschunggruppe geben, ansonsten lassen sich im weiteren keine Datensaätze anlegen, da sich die einzustellenden
Systemberechtigungen/Telnahmeerlaubnisse der Datensätze sich nach Forschungsgruppen richten.

Für unsere Zwecke wollen wir eine Froschungsgruppe 'Helmholtzzentrum für geologische Mäuseforschung' Kürzel 'Mouselab' anlegen.

### Planung der Datensatz-Typen

Zunächst muss geplant werden welche Datensatz-Typen es überhaupt geben soll und weiterhin, welche Felder diese später haben sollen,
da sich daraus ergibt in welcher Reihenfolge die Datensatz-Typen und ggf Hilfstabellen angelegt werden müssen.
Wenn es beispielsweise in einem Probandentyp 'Mäuse' ein Feld 'Labor' geben soll welches einen Zeiger auf einen Datensatz vom Typ 'Labore'
in der Haupttabelle 'Locations' geben soll muss zuerst der Datensatz-Typ 'Labore' angelegt werden, bevor das Feld im Probanden-Typ definiert werden kann.
Das selbe gilt für Felder die Werte aus Hilfstabellen beinhalten sollen. So muss z.B. zuerst die Hilfstabelle 'Blutgruppen'
angelegt werden bevor ein entsprechendes feld in einem Datensatz-Typ angelegt werden kann.

### Anlegen von Hilfstabellen

Zunächst müssen wir die Tabelle selbst anlegen.
Dazu in der Seitennavigation unter 'Hilfstabellen' und dann auf 'Neuer Eintrag' gehen. Das Formular enthält nur ein einzelnes Feld,
welches die Bezeichnung der Hilfstabelle selbst ist. Wenn wir Blutgruppen anlegen wollen würden wir hier auch 'Blutgruppen' eintragen.
Nach dem Speichern sollte die Neue Hilfstabelle in der Liste sichtbar sein.

Jetzt können wir die Werte hinzufügen die es in dieser Hilfstabelle geben soll. Im Falle von Blutgruppen wollen wir vmtl. die Werte 'A', 'B', 'AB' und '0'.
Um einen Wert in die Hilfstabelle Einzutragen klicken wir zunächst auf das Burger-Icon auf der Linken Seite (die 3 horizontalen Striche),
dies führt uns zur Liste mit den aktuellen Werten in dieser Hilfstabelle. Mit dem klick auf 'Neuer Eintrag' gelangen wir zum Formular, welches von uns erwartet
eine Bezeichnung einzugeben. Für unsere erste Blutgruppe würden wir einfach 'A' eintragen und auf 'Speichern' klicken.

### Anlegen von Datensatz-Typen dynamischer Haupttabellen

Unser Ziel solle es in diesem allgemeinen Beispiel sein einen Probanden-Typ 'Mäuse'
mit dem Feldern 'Name', 'Labor', 'Blutgruppe' und 'Geburtsdatum' anzulegen.
* Das Feld 'Name' soll einfach ein Freitext-Feld für den Namen der Maus sein.
* Das Feld 'Labor' soll auf einen Eintrag aus der Haupttabelle 'Locations' zeigen.
* Im Feld 'Blutgruppe' soll ein Wert aus der Menge 'A', 'B', 'AB' und '0' stehen.
* Das Feld 'Geburtsdatum' soll den Tag der Geburt der Maus enthalten und zudem als Referenzfeld für die Altersfenster bei Probanden-Auswahl dienen.

Bevor wir diesen Probanden-Typ anlegen können müssen wir zunächst zumindest den Location-Typ 'Labore' anlegen.
Für das Feld 'Blutgruppe' ist es sinnvoll eine Hilfstabelle anzulegen, welche die Werte vorgibt, die möglich sein sollen; alternativ wäre aber auch
ein Freitext-Feld denkbar, auch wenn dieses deutlich fehleranfälliger ist (gross/kleinschreibung, vertipper, etc).

Die Felder 'Name' und 'Geburtsdatum' haben keine weiteren Voraussetzungen.

#### Anlegen Hilfstabelle 'Blutgruppen'
Das Anlegen der Hilfstabelle für 'Blutgruppen' ist im Abschnitt 'Anlegen von Hilfstabellen' beschrieben.
Hier müssen wir nur noch die Fehlenden Werte ergänzen.

#### Anlegen Location-Typ 'Labore'
Dieser soll die Felder 'Labor-Bezeichnung' und 'Etage' haben (beides Freitext-Felder).
Dabei sollen beide Felder Pflichfelder sein.

Zum anlegen gehen wir in der Seiten-Navigation unter 'Datensatz-Typen' und dann auf 'Neuer Eintrag'.
Dort wählen wir bei 'Collection' den Wert 'Locations' und tragen bei 'Bezeichnung' den Wert 'Labore' ein.

Nach dem Speichern werden wir auf die Detail-Ansicht des neuen Datensatz-Typs geleitet.
Im Kopf der Ansicht sehen wir unter anderem die Zeile mit 'Interner Type-Key' (Zeile 2).
Diesen Wert benötigen wir später beim anlegen des Typs 'Mäuse' nochmal (leider zur Zeit noch).

Zum anlegen der Felder navigieren wir in den Tab 'Feld-Editor' (rechts).
Ein klick auf 'Neues Feld' öffnet das Formular zum erstellen neuer Felder.

Als Feld-Typ wählen wir jeweils 'Freitext - Einzeilig (SaneString)' und als Anzeigename 'Labor-Bezeichnung' und 'Etage'.
Zudem tragen wir bei 'Zeichen (mindestens)' den Wert '1', dies enspricht bei Zeichenketten einem Pflichtfeld.
Nach dem Speichern sollten die Felder jeweils in der angezeigten Feldliste sichtbar sein und mit 'neu' markiert sein.

Die Felder mit 'neu' sind nur vorläufige Felder, d.h. sie sind noch nicht fixiert und werden daher noch an keiner anderen stelle angezeigt.
Vorläufige Felder können wieder Vollständig gelöscht werden. Bei Feldern die bereits fixiert sind ist dies z.Z.
noch nicht möglich diese können nur ausgeblendet werden (und dann auch wieder hergestellt).
Wir wollen diesen Teil mit einem klick auf 'Felder fixieren' abschliessen.

Jetzt können wir die Anzeige der Datensätze im Benutzer-Interface definieren. Dazu gehen wir in den Tab 'Live-Settings' (links).
Hier gibt es 3 Sachen zu konfigureiern:
* **Anzeigefelder Tabellen**\
Hier werden die Spalten in den allgemeinen Übersichtstabellen definiert.

* **Anzeigefelder Options-Listen**\
    Hier werden die Spalten definiert die Angezeigt werden, wenn der Wert eines Feldes eines Datensatzes eines anderen Datensatz-Types ausgewählt werden soll,
    wobei der Wert vom aktuellen Datensatz-Typ sein soll. Oder einfacher gesagt: wenn wir später den Probanden-Typ 'Mäuse'
    und eine Maus anlegen müssen wir ein labor für die Maus festlegen. Dazu bekommen wir eine Auswahlliste an Laboren angezeigt.
    Die hier definierten spalten, werden dann dort angezeigt. Der Platz dort ist begrenzter als in den allgemeinen Listen, daher kann es hier sinnvoll sein
    weniger Spalten zu haben.

* **Kurzanzeige bei Referenzierung**\
    Hier wird das Format definiert, welches genutzt wird um einen Datensatz dieses Typs in Text-Form anzuzeigen. Beispielsweise geschieht das in der
    Detail Ansicht für 'Mäuse', da dort das entsprechende Labor hinterlegt ist.


Die Konfiguration der Jeweiligen Anzeigefelder läuft analog Folgendermassen ab:
Ein Klick auf 'Edit' bringt uns in das Formular zum bearbeiten. Hier sind zunächst keine Spalten definiert.
Ein Klick auf das Dropdown zeigt uns alle verfügbaren Tabellen felder + die ID an. Wir können jetzt en Feld auswählen und auf "hinzufügen" klicken.
Für 'Anzeigefelder Tabellen' wollen wir 'Labor-Bezeichnung' und 'Etage' als Spalten hinzufügen. Für 'Anzeigefelder Optionslisten' nur 'Labor-Bezeichnung'.
Die Reihenfolge lässt sich über die Pfeil-Buttons links beeinflussen, der X-Button entfernt die spalte wieder.
Haben wir alle gewünschten Spalten hinzugefügt klicken wir auf 'Speichern' klicken.

Die Konfiguration der 'Kurzanzeige bei Refereinzierung' besteht aus 2 Teilen, Teil 1 ist das festlegen der Werte die mit dem Format werden sollen.
Teil 2 liegt im fetslegen des Formates selbst, mit platzhaltern für die entsprechenden Werte.

Für unser Beispiel wollen wir die labore nach folgendem Muster anzeigen 'Labore-Bezeichnung (Etage)' (also z:b. 'Gamma-Labor (Etage 2)').
Nach einem klick auf 'Edit' bekommen wir wieder das Formular zur Bearbeitung. Teil 1 läuft analog zum eintragen der Werte für die 'Anzeigefelder Tabellen' ab.
Für das Format tragen wir folgenden Wert ein: '${#} (Etage ${#})' dabei ist '${#}' ein Platzhalter für einen der hinzugefügten Werte,
diese werden in der entsprechenden Reihenfolge ausgetauscht.

Optional können wir jetzt schon einen Labor-Datensatz anlegen (unter Locations -> Labore)

#### Anlegen Probanden-Typ 'Mäuse'
Nachdem wir nun die Vorausgesetzten Tabellen 'Labore' und 'Blutgruppen' angelegt haben können wir uns dem Probanden-Type zuwenden.
Wie beim Datensatz-Type 'Labore' gehen wir zunächst in der Seiten-Navigation auf 'Datensatz-Typen' und auf 'Neuer Eintrag'.
Als Collection wählen wir 'Probanden' und als 'Anzeigename' den Wert 'Mäuse'.

Probanden können je nach dem was sie in der realen Welt abbilden, Datenschutz relaevante Daten enthalten.
Um dies zu kennzeichnen bestehen Probanden-Datensätze aus 2 Kanälen. Einem Kanal 'Datenschutz' der die Personenbezogenen Daten enthält die **nicht** wissenschaftlich oder systemtechnisch relevant sind.
Und einem Kanal 'Normal' der alle Daten enthält die nicht datenschutzrechtlich relevant sind, von wissenschaftlicher Bedeutung.
Beispielsweise ist das Geburtsdatum zwar datenschutztechnisch relevant, aber muss aus systemtechnischen Gründen gespeichert bleiben,
wenn das Alter der Probanden zum Testzeitpunkt relevant ist (bzw wenn wir Altersfenster zur Auswahl benutzen wollen).

Für Mäuse benötigen wir keine Felder im Datenschutz-Kanal, wenn es sich um menschen Handeln sollte wären aber Felder, wie Vor-/Nachname, Adresse, Email, Telefon etc in diesem kanal angesiedelt.

Hier werden wir alle Felder im Daten-Kanal 'Normal' anlegen.

Im Feld-Editor legen wir jetzt folgende Felder an:
1. **Name**\
**Feld-Typ: 'Zeichenkette - Einzeilig (SaneString)'; Zeichen: '1'**

2. **Geburtsdatum**\
**Feld-Typ: 'Datum mit Server-Zeitzone (DateOnlyServerSide)'; isSpecialAgeFrameField: Ja**\
Hier bedürfen 2 Sachen einer Erklärung. Der Wert bei 'isSpecialAgeFrameField' bestimmt ob das Feld im sinne der Altersfensterauswahl benutzt werden soll.
Datensätze können jeweils nur ein Feld mit dieser einstellung auf 'Ja' haben, weil das System ansonsten nicht weiss auf welches Datum sich das
Altersfenster bezieht.
Der Begriff 'Server-Zeitzone' bedeutet, dass für das Datum eine Zeitzonen Korrektur durchgeführt werden soll. Hintergrund ist dass ein ein Datum alleine
(also ohne Uhrzeit) kein echter Zeitpunkt ist und nicht sinnvoll zu Berechnungen genutzt werden kann.

3. **Labor**\
**Feld-Typ: 'Eintrag anderer Haupttabellen (ForeignId)'; Referenz-Tabelle: 'Locations'; recordType: 'labore'**\
Zur Zeit ist es leider noch so, dass man den Datensatz-Typ manuell eintragen muss; dieser wert korrespondiert mit dem Wert bei 'Interner Type-Key' aus dem
Datensatz-Labore. Die gross/kleinschreibung ist wichtig, interne Type-Keys sind immer klein geschrieben und enthalten keine Umlaute ('m_use' statt 'Mäuse')

4. **Blutgruppe**\
**Feld-Typ: 'Hifstabellen-Eintrag (HelperSetItemId)'; setId: 'Blutgruppen'**

Danach können wir die Felder fixieren. Die Tabellen-Spalten und das Format für Kurzanzeige werden analog zu den Laboren definiert.
Für Letzteres wollen wir vermutlich nur den wert 'ID' durch den Wert 'Name' austauschen.

### Anlegen Studien-Typ 'Standard'
Auch Studien setzen sich, wie beschrieben aus statischen und benutzerdefinierten Feldern zusammen.
Alle Felder die für den Betrieb relevant sind, sind hier schon statisch definiert,
benutzerdefinierte Felder können aber helfen wenn weiterführende Beschreibungen
z.B. der gesamte Abstract des Papers nach veröffentlichung hinterlegt werden soll
(z.B. zu Archivzwecken; war damals bei der Apestudies Datennbank glaub ich so)

Um Studien durchführen zu können benötigen wir aber mindestens einen Entsprechenden Datensatz-Typ.
Wir wollen hier auf benutzerdefinierte Felder verzichten (würden wir im childab vermutlich sowieso).

Nah dem anlegen des Datensatz-Typs (Collection: 'Studien', Anzeigename: 'Standard') navigieren wir in den Feld-Editor n klicken direkt auf 'Felder fixieren'.
wir teilen dem System so mit das wir keine weiteren Felder hinzufügen wollen und geben den Stiden-Typ so wie er ist frei.

Für die Anzeigefelder haben wir dadurch automatisch Zugriff auf 'Kürzel', 'Studienname' und 'Wissenschaftler'. Diese sind Statisch definiert des weiteren gibt es nich mehrere weitere felder (z.B. Laufzeit; die hab ich aber noch nicht als statische spaltenoptionen hinterlegt merke ich grade)

### System-Rollen und Mitarbeiter-Accounts
Nutzer-Accounts können zu einer oder mehreren Forschungsgruppen gehören.
Die funktionalen Berechtigungen nicht-admin Nutzeraccounts richten sich nach der eingestellten System-Rolle des Accounts für die Entsprechende Forschungsgruppe.
Die Zugriffsberechtigungen auf die einzelnen Datensätze richten sich nach den Lese/Schreib-Berechtigung im jeweiligen Datensatz.

Bevor also nicht-admin Accounts angelegt werden können muss mindestens eine System-Rolle angelegt werden.
Die Einstellung der System-Rolle findet im Mitabeiter-Feld 'Forschungsgruppen' statt. Wenn dort ein Wert hinzugefügt wird (kleines plus) kann dort Forschungsgruppe und zugehörige System-Rolle eingestellt werden.

Zur zeit ist es nocht nicht möglich über das benutzerinterface Passwörter zu vergeben.


(Ich glaub das ist halbwegs selbsterklärend, was bei System-Rollen zu tun ist, deshalb lass ichs hier erstmal weg)


## Informationen zu Feld-Typen

* **Adresse (Address)**\
Kombinationsfeld bestehend aus Strasse, Hausnummer, PLZ, Ort
* **Benutzerdefinierte Unterliste (ListOfObjects)**
Bietet die Möglichkeit vollständig benutzerdefinierte Wertlisten anzulegen
* **Datum + Zeit (DateTime)**\
Field mit Datum und Uhrzeit (uhrzeit in stunden und minuten)
* **Datum mit Server-Zeitzone (DateOnlyServerSide)**\
Feld welches ein Datum ohne Zeit annehmen kann. Dabei wird eine Zeitzonen Korrektur durchgeführt. Hintergrund ist dass ein ein Datum alleine
(also ohne Uhrzeit) kein echter Zeitpunkt ist und nicht sinnvoll zu Berechnungen genutzt werden kann.
'isSpecialAgeFrameField' gibt hier an ob das Feld als Referenz-Feld für die Altersfenster Prüfung genutzt wird.
* **Eintrag anderer Haupt-Tabelle (ForeignId)**\
Feld welches eine Referenz auf einen Datensatz einer anderen Haupt-Tabelle enthält. Es ist auch möglich die selbe Haupt-Tabelle zu Referenzieren, um zum beispiel Geschwister oder Elternverhältnisse darzustellen, allerdings ist die Datenbank noch nicht clever genug um die Rück-Referenzen entsprechend zu managen.
* **Email-Adresse (Email)**\
Feld das eine einzelne Email-Adresse enthält
* **Freitext - Einzeilig (SaneString)**\
Ein einzeiliges Freitext-Feld z.B. für Vorname/Nachname;
'Zeichen (mindestens)' grösser als 0 macht das Feld zu einem Pflicht-Feld
* **Freitext - Mehrzeilig (FullText)**\
Sinnvoll für längere Beschreibungstexte.
'Zeichen (mindestens)' grösser als 0 macht das Feld zu einem Pflicht-Feld
* **Geo-Koordinaten (GeoCoords)**\
Geographische Länge und Breite
* **Geschlecht (BiologicalGender)**\
Männlich/Weiblich
* **Hilfstabellen-Eintrag (HelperSetItemId)**\
Feld welches einen einzelnen Wert aus einer Hilfstabelle enthält.
'setId' gibt aus welcher Hilfs-tabelle der Wert stammen soll
* **Ja/Nein-Wert (DefaultBool)**\
Brauch ich glaub ich nicht gross erklären.
* **Ja/Nein/Unbekannt-Wert (ExtBool)**\
Bietet sich für werte an bei denen explizit ein unbekannt aufgenaommen werden soll um ggf nochmal nachzufragen.
* **Liste von EInträgen anderer Haupttabellen (ForeignIdList)**\
Wie 'ForeignId' aber kann mehrere datensatz-referenzen enhalten.
'Mindestanzahl' gibt an Wieviele werte mindestens angegeben werden müssen,
* **Liste von Email-Adressen (EmailList)**\
Wie Email, nur mehrere. Enthält zudem pro Eintrag eine haken ob die Adresse die Primäradresse ist
(für das versenden von Emails relevant, wenn nicht an alle gesendet werden soll)
'Mindestanzahl' gibt an Wieviele werte mindestens angegeben werden müssen,
* **Liste von EInträgen Hilfstabelle (ForeignIdList)**\
Wie 'HelperSetItemId' aber mehrere.
'Mindestanzahl' gibt an Wieviele werte mindestens angegeben werden müssen,
* **Liste von Telefon-Nummern (PhoneList)**\
Wie Phone, nur mehrere. Enthält zudem pro Eintrag zudem den Typ (also 'geschäftlich', 'privat', 'mobil')
'Mindestanzahl' gibt an Wieviele werte mindestens angegeben werden müssen,
* **Telefonnummer**\
Eine einzelne Telefonnummer

