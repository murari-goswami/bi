-- Name: am.base
-- Created: 2015-04-28 18:52:17
-- Updated: 2015-05-20 17:44:04

CREATE VIEW am.base AS
SELECT
bp.*,
sg.size_group_code "size_group_code"
FROM "am.base_pre" bp
LEFT JOIN "am.pim_model__size_group_code__indexed" sg ON sg.pim_model_id = bp.pim_model_id


