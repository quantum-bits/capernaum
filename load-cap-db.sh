DBNAME=capernaum-staging

createdb $DBNAME
psql --dbname $DBNAME --file ./cap-db-2021-07-28T10\:51\:31-04\:00.sql 
