-- Name: am.example_variant
-- Created: 2015-04-24 18:24:32
-- Updated: 2015-04-24 18:24:32

CREATE VIEW "am.example_variant" AS
SELECT
v.*
FROM "am.variant" v
INNER JOIN "am.example_base" eb ON eb.pim_model_id = v.pim_model_id


