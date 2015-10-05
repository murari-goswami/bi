-- Name: raw.desk_user_case_details
-- Created: 2015-09-08 17:32:03
-- Updated: 2015-09-08 17:40:48

CREATE VIEW raw.desk_user_case_details
AS
SELECT 
	vv."name" as "user_name", 
	vv."email" as "user_email",	
	drc."id" as "case_id", 
	drc."priority" as "case_priority",
	drc."label_ids" as "label_ids",
	drc."changed_at", drc."created_at", drc."updated_at", drc."first_opened_at",
	drc."opened_at",drc."first_resolved_at",drc."resolved_at", drc."status",
	drc."has_pending_interactions", drc."description",
	drc."type",drc."labels",drc."subject", drc."customer_href", drc."replies_count", drc."notes_count"
from "dwh.desk_raw_cases" drc LEFT OUTER JOIN
(
	call "desk_com_connector.get_list_users" ()
) vv ON drc.userid=vv.id
where drc.userid <> 0;


