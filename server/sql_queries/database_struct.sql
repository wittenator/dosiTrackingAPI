/* sets up the basic database design*/
CREATE TABLE people (rfid INT NOT NULL, name VARCHAR(55) NOT NULL, lastname VARCHAR(55) NOT NULL, ressort VARCHAR(55) NOT NULL, lastChanged DATETIME, PRIMARY KEY(rfid));
CREATE TABLE attendance(rfid INT NOT NULL, sessionid INT, deviceid VARCHAR(17) NOT NULL, time DATETIME NOT NULL, FOREIGN KEY(rfid) REFERENCES people(rfid));
CREATE TABLE sessions (sessionid INT NOT NULL AUTO_INCREMENT, name VARCHAR(55) NOT NULL, type VARCHAR(55) NOT NULL, starttime DATETIME NOT NULL, endtime DATETIME NOT NULL ,PRIMARY KEY(sessionid));
CREATE TABLE devices (deviceid VARCHAR(17), UNIQUE KEY(deviceid));
CREATE TABLE peopleCount (quantity INT NOT NULL, time DATE NOT NULL, UNIQUE KEY(time));

/* creates trigger to count the amount of people over time */
CREATE TRIGGER countAddPeople AFTER INSERT ON people
FOR EACH ROW
INSERT INTO peopleCount (quantity, time)
VALUES 
  ((SELECT COUNT(*) FROM people), CURDATE())
  ON DUPLICATE KEY UPDATE quantity = VALUES(quantity); 

CREATE TRIGGER countDeletePeople AFTER DELETE ON people
FOR EACH ROW
INSERT INTO peopleCount (quantity, time)
VALUES 
  ((SELECT COUNT(*) FROM people), CURDATE())
  ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);

/*create stored procedure*/
CREATE PROCEDURE insertAttendance(OUT:time DATETIME, OUT :rfid BIGINT, OUT :deviceID VARCHAR(17))
BEGIN
  IF EXISTS (SELECT 1 FROM sessions WHERE :time  >= DATE_SUB(starttime, INTERVAL 3 HOUR) AND :time <= DATE_ADD(endtime, INTERVAL 3 HOUR))
  THEN
    INSERT INTO attendance (rfid, sessionid, time, deviceid)
      VALUES
      (:rfid, (SELECT sessionid from sessions WHERE :time  >= DATE_SUB(starttime, INTERVAL 3 HOUR) AND :time <= DATE_ADD(endtime, INTERVAL 3 HOUR) LIMIT 1), :time, :deviceid);
  ELSE
    INSERT INTO attendance (rfid, time, deviceid)
    VALUES
      (:rfid, :time, :deviceid);
END IF;
END;

/* inserts test values*/
INSERT INTO people (rfid, name, lastname, ressort)
VALUES 
  (3966584180, 'Caterina', 'Betz', 'HR'),
  (2365005684, 'Hans', 'Hosenfeld', 'IT'),
  (3960083572, 'Irma', 'Klünker', 'QM'),
  (208489076, 'Jonas', 'Zell', 'QM'),
  (2387422811, 'Lennart', 'Berger', 'RM'),
  (3155969396, 'Lukas', 'Hoffmann', 'IT'),
  (3960571764, 'Matthias', 'Göttl', 'Vorstand'),
  (2091137140, 'Maximilian', 'Eißler', 'Vorstand'),
  (1022571892, 'Maximilian', 'Gracz', 'QM'),
  (1556629876, 'Nils', 'Kassebohm', 'RM'),
  (3702414964, 'Philip', 'Stange', 'QM'),
  (1011844468, 'Philip', 'Hasenklever', 'QM'),
  (472933748, 'Shakhlo', 'Abduganieva', 'HR'),
  (2889517940, 'Shalin Sara', 'Baier', 'QM'),
  (1556235124, 'Timur', 'Basilik', 'HR'),
  (1009406836, 'Yannik', 'Schmid', 'IN'),
  (2084317556, 'Zebo', 'Abduganieva', 'Vorstand'),
  (1818972020, 'Patrick', 'Armanious', 'QM');
  
INSERT INTO sessions (name, type, starttime, endtime)
VALUES 
  ('Testevent', 'DoSi', '2017-02-02 11:00:00', '2017-02-02 15:00:00'),
  ('PR Schulung', 'Schulung', '2016-12-15 10:40:00', '2016-12-15 14:50:00'),
  ('DoSi am 19.12', 'DoSi', '2016-12-19 18:30:00', '2016-12-19 22:30:00');
  
INSERT INTO attendance (rfid, sessionid, deviceid, time)
VALUES 
  (1, 1, 'AF:CC:90:AA:32:43', '2016-12-12 18:40:00'),
  (2, 1, 'AF:CC:90:AA:32:43', '2016-12-12 18:20:15'),
  (2, 2, '62:C6:3F:00:27:FD', '2016-12-19 17:20:15');
