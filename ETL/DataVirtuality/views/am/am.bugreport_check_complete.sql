-- Name: am.bugreport_check_complete
-- Created: 2015-05-04 14:17:38
-- Updated: 2015-05-04 14:17:38

CREATE VIEW am.bugreport_check_complete AS
SELECT
c.pim_model_id,
(c.has_all AND cvg.has_all_in_group ) "all_okay"
FROM "am.check_base__all" c
LEFT JOIN "am.check_variant__grouped" cvg ON cvg.pim_model_id = c.pim_model_id


