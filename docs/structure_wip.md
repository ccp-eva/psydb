# Leitfaden

## Inhaltsverzeichnis
1. [Allgemeiner Ablauf](#allgemeiner-ablauf)
    - [Grundsätzliche Begriffsklärung](#grundsätzliche-begriffsklärung)
2. [Anlegen von Forschungsgruppen](#anlegen-von-forschungsgruppen)
3. [Planung der Datensatz-Typen](#planung-der-datensatz-typen)
4. [Anlegen von Hilfstabellen](#anlegen-von-hilfstabellen)
5. [Anlegen von Datensatz-Typen dynamischer Haupttabellen](#anlegen-von-datensatz-typen-dynamischer-haupttabellen)
    - [Anlegen Hilfstabelle 'Blutgruppen'](#anlegen-hilfstabelle-blutgruppen)
    - [Anlegen Location-Typ 'Labore'](#anlegen-location-typ-labore)
    - [Anlegen Probanden-Typ 'Mäuse'](#anlegen-probanden-typ-mäuse)
6. [Anlegen Studien-Typ 'Standard'](#anlegen-studien-typ-standard)
7. [System-Rollen und Mitarbeiter-Accounts](#system-rollen-und-mitarbeiter-accounts)
8. [Informationen zu Feld-Typen](#informationen-zu-feld-typen)

---

## Allgemeiner Ablauf

Nach der Grund-Initialisierung gibt es einen Admin-Nutzeraccount, mit dem das initiale Setup durchgeführt wird. Hier ein Überblick über den allgemeinen Ablauf mit einfachen, fiktiven Werten.

### Grundsätzliche Begriffsklärung

1. **Hilfstabellen (Helper-Set)**  
   Benutzerdefinierte Tabellen mit einfachen Einträgen, die lediglich eine Bezeichnung benötigen. Beispiele: Novels, Sprachen.

2. **Statische Haupttabellen**  
   Enthalten vordefinierte Felder und keine benutzerdefinierten Datensatz-Typen. Beispiele: Forschungsgruppen, Mitarbeiter, Systemrollen, Themengebiete.

3. **Dynamische Haupttabellen (Collections)**  
   Unterstützen benutzerdefinierte Datensatz-Typen und Felder. Beispiele: Probanden, Locations, Studien, Externe Personen, Externe Organisationen.

4. **Datensätze**  
   Einträge in Tabellen. Bemerkungen nach Art:
   - Hilfstabellen: ein einzelnes Bezeichnungsfeld (z.B. Spanisch).
   - Statische Haupttabellen: enhalten ausschliesslich vordefinierte definierte Felder.
   - Dynamische Haupttabellen: Kombination aus vordefinierten und benutzerdefinierten Feldern. Die bereits vordefinieten
     Felder spezifisch zur Haupttabelle, Studien enthalten z.B. immer `Start` und `Ende`. Alle Datensätze enthalten immer das Feld `Kommentar`

---

## Anlegen von Forschungsgruppen

- **Startzustand:** Keine Forschungsgruppen vorhanden.  
- **Mindestens eine Forschungsgruppe erforderlich:** Notwendig für Systemberechtigungen und Teilnahmeerlaubnisse.

**Beispiel:**  
Wir erstellen die Forschungsgruppe `Helmholtzzentrum für geologische Mäuseforschung` mit dem Kürzel `Mouselab`.

---

## Planung der Datensatz-Typen

Vor dem Anlegen von Datensatz-Typen und Hilfstabellen sollten folgende Punkte geplant werden:
- Welche Datensatz-Typen werden benötigt?
- Welche Felder sollen diese haben?  
  **Beispiel:**  
  Ein Probanden-Typ `Mäuse` mit dem Feld `Labor`, das auf einen Datensatz vom Typ `Labore` verweist. Der Typ `Labore` muss zuerst angelegt werden.

---

## Anlegen von Hilfstabellen

### Schritte:
1. **Tabelle anlegen:**  
   - Navigation: **Hilfstabellen → Neuer Eintrag**  
   - Formular: Name der Hilfstabelle eintragen (z. B. `Blutgruppen`).  
2. **Werte hinzufügen:**  
   - Navigation: Burger-Icon → Liste der Werte → **Neuer Eintrag**  
   - Beispiel: `A`, `B`, `AB`, `0`.

---

## Anlegen von Datensatz-Typen dynamischer Haupttabellen

### Anlegen Hilfstabelle 'Blutgruppen'
- **Beschreibung:** Siehe [Anlegen von Hilfstabellen](#anlegen-von-hilfstabellen).  
- Ergänzen der Werte: `A`, `B`, `AB`, `0`.

### Anlegen Location-Typ 'Labore'

#### Felder:
- **Labor-Bezeichnung:** Freitext, Pflichtfeld.  
- **Etage:** Freitext, Pflichtfeld.

#### Schritte:
1. **Navigation:** **Datensatz-Typen → Neuer Eintrag**  
   - Collection: `Locations`  
   - Bezeichnung: `Labore`  
2. **Felder anlegen:**
    - Feld: `Labor-Bezeichung`
        - Feld-Typ: `Freitext - Einzeilig (SaneString)`  
        - Pflichtfeld: `Ja`
    - Feld: `Etage`
        - Feld-Typ: `Freitext - Einzeilig (SaneString)`  
        - Pflichtfeld: `Ja`
3. **Felder fixieren:** Vorläufige Felder werden festgelegt.
4. **Live-Settings konfigurieren:** Spalten und Kurzanzeige definieren.  

### Anlegen Probanden-Typ 'Mäuse'

#### Felder:
1. **Name:** Freitext, Pflichtfeld.  
2. **Geburtsdatum:** Datum mit Server-Zeitzone, Altersfenster-Referenzfeld.  
3. **Labor:** Referenz auf `Locations (Labore)`.  
4. **Blutgruppe:** Wert aus Hilfstabelle `Blutgruppen`.

#### Schritte:
1. **Navigation:** **Datensatz-Typen → Neuer Eintrag**  
   - Collection: `Probanden`  
   - Bezeichnung: `Mäuse`  
2. **Felder anlegen und fixieren:** Analog zu `Labore`.  

---

## Anlegen Studien-Typ 'Standard'

- **Beschreibung:** Studien bestehen aus statischen und benutzerdefinierten Feldern.  
- **Schritte:**  
  1. Navigation: **Datensatz-Typen → Neuer Eintrag**  
     - Collection: `Studien`  
     - Bezeichnung: `Standard`  
  2. **Felder fixieren:** Benutzerdefinierte Felder überspringen.  

---

## System-Rollen und Mitarbeiter-Accounts

- **Beschreibung:** Nutzer-Accounts gehören zu Forschungsgruppen.  
- **System-Rollen:** Definieren funktionale Berechtigungen.  
- **Wichtig:** Mindestens eine System-Rolle muss angelegt werden, bevor nicht-Admin-Accounts erstellt werden können.

---

## Informationen zu Feld-Typen

| Feld-Typ                                  | Beschreibung                                                                                                                                                                                                                                      |
|-------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Adresse (Address)**                     | Ein kombiniertes Feld bestehend aus Straße, Hausnummer, Postleitzahl (PLZ) und Ort.                                                                                                                                                              |
| **Benutzerdefinierte Unterliste (ListOfObjects)** | Ermöglicht das Anlegen vollständig benutzerdefinierter Wertlisten.                                                                                                                                                                       |
| **Datum + Zeit (DateTime)**               | Ein Feld für Datum und Uhrzeit (Stunden und Minuten).                                                                                                                                                                                            |
| **Datum mit Server-Zeitzone (DateOnlyServerSide)** | Ein Feld für ein Datum ohne Zeitangabe, das mit einer Zeitzonen-Korrektur verarbeitet wird. Diese Korrektur ist notwendig, da ein Datum ohne Zeit keine eindeutige Berechnungsgrundlage bietet. Das Attribut `isSpecialAgeFrameField` gibt an, ob das Feld zur Altersfensterprüfung verwendet wird. |
| **Eintrag anderer Haupt-Tabelle (ForeignId)** | Ein Feld, das auf einen Datensatz einer anderen Haupttabelle verweist. Es kann auch auf die gleiche Tabelle verweisen, um beispielsweise Geschwister- oder Elternbeziehungen darzustellen. Allerdings ist die Datenbank derzeit nicht in der Lage, Rückverweise automatisch zu handhaben. |
| **E-Mail-Adresse (Email)**                | Ein Feld, das eine einzelne E-Mail-Adresse speichert.                                                                                                                                                                                            |
| **Freitext - Einzeilig (SaneString)**     | Ein einzeiliges Freitextfeld, z. B. für Vor- oder Nachnamen. Wenn `Zeichen (mindestens)` größer als 0 ist, wird das Feld zu einem Pflichtfeld.                                                                                                    |
| **Freitext - Mehrzeilig (FullText)**      | Ein mehrzeiliges Textfeld, das sich für längere Beschreibungen eignet. Wenn `Zeichen (mindestens)` größer als 0 ist, wird das Feld zu einem Pflichtfeld.                                                                                          |
| **Geo-Koordinaten (GeoCoords)**           | Ein Feld für geografische Länge und Breite.                                                                                                                                                                                                      |
| **Geschlecht (BiologicalGender)**         | Ein Feld zur Auswahl von männlich oder weiblich.                                                                                                                                                                                                 |
| **Hilfstabellen-Eintrag (HelperSetItemId)** | Ein Feld, das einen einzelnen Wert aus einer Hilfstabelle enthält. Das Attribut `setId` gibt an, aus welcher Hilfstabelle der Wert stammt.                                                                                                       |
| **Ja/Nein-Wert (DefaultBool)**            | Ein einfaches Feld für Ja/Nein-Werte.                                                                                                                                                                                                            |
| **Ja/Nein/Unbekannt-Wert (ExtBool)**      | Ein erweitertes Ja/Nein-Feld, das die Option `Unbekannt` umfasst. Diese Option ist nützlich, wenn später eine Klärung erforderlich ist.                                                                                                           |
| **Liste von Einträgen anderer Haupttabellen (ForeignIdList)** | Ähnlich wie `ForeignId`, jedoch für mehrere Datensatzreferenzen. Das Attribut `Mindestanzahl` gibt an, wie viele Werte mindestens angegeben werden müssen.                                                                                       |
| **Liste von E-Mail-Adressen (EmailList)**  | Ähnlich wie `Email`, jedoch für mehrere Einträge. Zusätzlich kann pro Eintrag ein Haken gesetzt werden, um die primäre Adresse zu markieren (relevant für E-Mails, die nicht an alle Adressen gesendet werden sollen). `Mindestanzahl` gibt an, wie viele Werte mindestens angegeben werden müssen. |
| **Liste von Einträgen Hilfstabelle (ForeignIdList)** | Ähnlich wie `HelperSetItemId`, jedoch für mehrere Werte. Das Attribut `Mindestanzahl` gibt an, wie viele Werte mindestens angegeben werden müssen.                                                                                               |
| **Liste von Telefonnummern (PhoneList)**  | Ähnlich wie `Telefonnummer`, jedoch für mehrere Nummern. Pro Eintrag kann ein Typ (z. B. `geschäftlich`, `privat`, `mobil`) angegeben werden. Das Attribut `Mindestanzahl` gibt an, wie viele Werte mindestens angegeben werden müssen.                                                |
| **Telefonnummer**                         | Ein Feld für eine einzelne Telefonnummer.                                                                                                                                                                                                       |

---

**Hinweis:** Falls weitere Details zu Feld-Typen benötigt werden, können diese ergänzt werden.
