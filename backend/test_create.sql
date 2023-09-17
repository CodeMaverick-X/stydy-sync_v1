CREATE TABLE user (
  id INT IDENTITY(1,1) NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO user (name, password) VALUES ('admin', 'password');

