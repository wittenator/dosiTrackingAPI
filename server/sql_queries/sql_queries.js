/* Joins all relevant tables and returns people's names and their corresponding attendend sessions. */
exports.getAttendence = `
SELECT people.lastname, GROUP_CONCAT(sessions.name separator ', ') list
  FROM people
    INNER JOIN attendence
      ON people.rfid = attendence.rfid
    INNER JOIN sessions
      ON attendence.eventid = sessions.eventid
GROUP BY people.lastname;`;

/* If there is a session entry, which corresponds to your attendence entry timewise, it is linked automatically. Otherwise the entry is created without an session ID hoping that an event is created later. */
exports.insertAttendence = `
IF EXISTS (SELECT 1 FROM sessions where :time BETWEEN (starttime - 3 HOUR) AND (endtime + 3 HOUR))
THEN
  INSERT INTO attendence (rfid, sessionid, time, deviceID)
  VALUES
    (:name, (SELECT sessionid from sessions WHERE :time BETWEEN (starttime - 3 HOUR) AND (endtime + 3 HOUR) LIMIT 1), :time, :deviceID)
ELSE
  INSERT INTO attendence (rfid, time, deviceID)
  VALUES
    (:name, :time, :deviceID)
END IF;`;

/* Plainly returns all users. */
exports.getUsers = `
SELECT name, lastname, ressort, rfid
    FROM people;`;

/*  */
exports.insertUser = `
INSERT INTO people (name, lastname, ressort, rfid)
VALUES
    (:name, :lastname, :ressort, :rfid)
    ON DUPLICATE KEY UPDATE name = VALUES(name),
                            lastname = VALUES(lastname),
                            ressort = VALUES(ressort);`;

exports.getSessions = `
SELECT name, type, starttime, endtime
    FROM sessions;`;

exports.insertSession = `
IF NOT EXISTS(SELECT 1 FROM sessions WHERE (starttime BETWEEN :starttime AND endtime) OR (endtime BETWEEN :startime AND :endtime) OR (starttime <= :starttime AND endtime >= :endtime))
THEN
  INSERT INTO sessions (name, type, starttime, endtime)
  VALUES
    (:name, :type, :starttime, :endtime)  
END IF;`
;

exports.updateAttendence = `
UPDATE attendence
SET sessionid = (SELECT sessionid from sessions WHERE starttime = :starttime AND endtime = :endtime LIMIT 1)
WHERE time BETWEEN :starttime - 3 HOUR AND :endtime + 3 HOUR;`;

exports.insertMACAddress = `
INSERT INTO devices (MACAddress)
VALUES
    (:deviceID);`;