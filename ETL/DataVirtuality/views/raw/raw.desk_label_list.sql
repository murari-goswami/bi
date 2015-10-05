-- Name: raw.desk_label_list
-- Created: 2015-06-25 10:29:22
-- Updated: 2015-09-08 16:08:33

CREATE VIEW raw.desk_label_list
AS

SELECT 
	ss.id as label_id, 
	ss."name" as label_name, 
	ss.description as label_description, 
	ss.color as label_color
from
(
	call "desk_com_connector.get_list_labels" ()
) ss
where types='case'


