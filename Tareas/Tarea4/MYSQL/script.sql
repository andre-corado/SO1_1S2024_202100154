Create Database tarea4;
use tarea4;

create table albums(
    id_album INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    band_name varchar(40),
    album_name varchar(40),
    release_year varchar(5),
    ranking varchar(5)
);

use tarea4;
select * from albums;
' DELETE from albums; 