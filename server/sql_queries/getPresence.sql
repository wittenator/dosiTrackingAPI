SELECT personen.nachname, GROUP_CONCAT(veranstaltungen.name separator ', ')
  FROM personen
    INNER JOIN anwesenheit
      ON personen.rfid = anwesenheit.rfid
    INNER JOIN veranstaltungen
      ON anwesenheit.eventid = veranstaltungen.eventid
    WHERE anwesenheit.time BETWEEN '2016-12-12 00:00:00' AND '2016-12-18 00:00:00'
GROUP BY personen.nachname;