INSERT INTO people (name, lastname, ressort, rfid)
VALUES
    (:name, :lastname, :ressort, :rfid)
    ON DUPLICATE KEY UPDATE  name = VALUES(name),
                              lastname = VALUES(lastname),
                              ressort = VALUES(ressort);

