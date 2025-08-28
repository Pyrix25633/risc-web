-- ! Modify .env to use root user when executing the 'npx prisma db push' command

CREATE USER 'RISC-Web'@'localhost' IDENTIFIED BY 'StrongPa$$word@2024';

GRANT SELECT, INSERT, DELETE ON TempUser TO 'RISC-Web'@'localhost';
GRANT SELECT, INSERT, UPDATE ON User TO 'RISC-Web'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON File TO 'RISC-Web'@'localhost';