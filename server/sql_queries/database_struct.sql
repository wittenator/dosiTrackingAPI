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

/* inserts test values*/
INSERT INTO people (rfid, name, lastname, ressort)
VALUES 
  (1, 'Tim', 'Korjakow', 'Juniter'),
  (2, 'Axel', 'Bernhard', 'Juniter'),
  (3, 'Manuel', 'Schültke', 'Human Ressources');
  
INSERT INTO sessions (name, type, starttime, endtime)
VALUES 
  ('Dosi am 12.12.2016', 'DoSi', '2016-12-12 18:30:00', '2016-12-12 20:10:00'),
  ('PR Schulung', 'Schulung', '2016-12-15 10:40:00', '2016-12-15 14:50:00'),
  ('DoSi am 19.12', 'DoSi', '2016-12-19 18:30:00', '2016-12-19 22:30:00');
  
INSERT INTO attendance (rfid, sessionid, deviceid, time)
VALUES 
  (1, 1, 'AF:CC:90:AA:32:43', '2016-12-12 18:40:00'),
  (2, 1, 'AF:CC:90:AA:32:43', '2016-12-12 18:20:15'),
  (2, 2, '62:C6:3F:00:27:FD', '2016-12-19 17:20:15');
