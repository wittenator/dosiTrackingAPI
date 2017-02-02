/* Joins all relevant tables and returns people's names and their corresponding attendend sessions. */
exports.getAttendance = `
SELECT sessions.sessionid, sessions.name, CONCAT("[", GROUP_CONCAT( people.lastname separator ','), "]") list
  FROM people
    INNER JOIN attendance
      ON people.rfid = attendance.rfid
    INNER JOIN sessions
      ON attendance.sessionid = sessions.sessionid
GROUP BY sessions.name;`;

/* If there is a session entry, which corresponds to your attendance entry timewise, it is linked automatically. Otherwise the entry is created without an session ID hoping that an event is created later. */
exports.insertAttendance = `
IF EXISTS (SELECT 1 FROM sessions WHERE :time  >= DATE_SUB(starttime, INTERVAL 3 HOUR) AND :time <= DATE_ADD(endtime, INTERVAL 3 HOUR))
THEN
  INSERT INTO attendance (rfid, sessionid, time, deviceid)
  VALUES
    (:rfid, (SELECT sessionid from sessions WHERE :time  >= DATE_SUB(starttime, INTERVAL 3 HOUR) AND :time <= DATE_ADD(endtime, INTERVAL 3 HOUR) LIMIT 1), :time, :deviceid);
ELSE
  INSERT INTO attendance (rfid, time, deviceid)
  VALUES
    (:rfid, :time, :deviceid);
END IF;`;

/* Plainly returns all users. */
exports.getUsers = `
SELECT name, lastname, ressort, rfid
    FROM people;`;

/*  */
exports.insertUser = `
INSERT INTO people (name, lastname, ressort, rfid, lastChanged)
VALUES
    (:name, :lastname, :ressort, :rfid, CURTIME())
    ON DUPLICATE KEY UPDATE name = VALUES(name),
                            lastname = VALUES(lastname),
                            ressort = VALUES(ressort),
                            lastChanged = VALUES(lastChanged);`;

exports.getSessions = `
SELECT name, type, starttime, endtime
    FROM sessions;`;

exports.insertSession = `
IF NOT EXISTS(SELECT 1 FROM sessions WHERE (starttime BETWEEN :starttime AND :endtime) OR (endtime BETWEEN :startime AND :endtime) OR (starttime <= :starttime AND endtime >= :endtime))
THEN
  INSERT INTO sessions (name, type, starttime, endtime)
  VALUES
    (:name, :type, :starttime, :endtime);
  UPDATE attendance
  SET sessionid = (SELECT sessionid from sessions WHERE starttime = :starttime AND endtime = :endtime LIMIT 1)
  WHERE time  >= DATE_SUB(:starttime, INTERVAL 3 HOUR) AND time <= DATE_ADD(:endtime, INTERVAL 3 HOUR);
END IF;`
;

exports.insertMACAddress = `
INSERT INTO devices (deviceid)
VALUES
    (:deviceid);`;