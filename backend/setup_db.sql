-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS studysync_dev_db;
CREATE USER IF NOT EXISTS 'new_admin'@'%' IDENTIFIED BY 'admin-pass';
GRANT ALL PRIVILEGES ON *.* TO 'new_admin'@'%';
GRANT SELECT ON `performance_schema`.* TO 'new_admin'@'%';
FLUSH PRIVILEGES;
