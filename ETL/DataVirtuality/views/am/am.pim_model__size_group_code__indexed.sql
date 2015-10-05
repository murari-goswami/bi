-- Name: am.pim_model__size_group_code__indexed
-- Created: 2015-04-28 17:52:02
-- Updated: 2015-04-28 17:52:02

CREATE VIEW "am.pim_model__size_group_code__indexed"  AS
WITH "pim_model__size_group_count" AS (
	SELECT pim_model_id, COUNT(*) "size_group_count"
    FROM am.pim_model__size_group_code
    GROUP BY pim_model_id )
SELECT
sg.pim_model_id,
sg.size_group_code
FROM "pim_model__size_group_count" msgc
LEFT JOIN "am.pim_model__size_group_code" sg ON sg.pim_model_id = msgc.pim_model_id
WHERE size_group_count = 1


