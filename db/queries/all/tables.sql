-- database: /home/tsaxking/tators-dashboard-template/db/main.db

-- Use the ▷ button in the top right corner to run the entire file.



SELECT name
FROM sqlite_schema
WHERE 
    type ='table' AND 
    name NOT LIKE 'sqlite_%';