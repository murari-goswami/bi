-- Name: raw.desk_case_users
-- Created: 2015-06-25 11:05:44
-- Updated: 2015-08-20 15:55:31

CREATE VIEW raw.desk_case_users
AS

SELECT 
	vv.id as user_id, 
	vv."name" as user_name, 
	vv.email as user_email,
	vv.level as user_type,
	vv.created_at,
	vv.last_login_at
from
(
	call "desk_com_connector.get_list_users" ()
) vv


