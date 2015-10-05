-- Name: am.bugreport_base
-- Created: 2015-05-04 14:17:25
-- Updated: 2015-05-04 14:17:25

CREATE VIEW am.bugreport_base AS
SELECT
bp.*,
sg.size_group_code "size_group_code"
FROM "am.base_pre" bp
LEFT JOIN "am.pim_model__size_group_code__indexed" sg ON sg.pim_model_id = bp.pim_model_id


