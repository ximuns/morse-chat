alter table public.rooms
add column name text not null default 'UNTITLED ROOM';

alter table public.rooms
add constraint rooms_name_length
check (char_length(name) between 1 and 32);

