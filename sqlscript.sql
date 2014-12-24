CREATE TABLE codes(
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	code VARCHAR(32),
	current VARCHAR(32)
);

INSERT INTO codes VALUES(null,'9090','test.js');
INSERT INTO codes VALUES(null,'9191','default.js');