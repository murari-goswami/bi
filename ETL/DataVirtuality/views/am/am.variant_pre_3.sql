-- Name: am.variant_pre_3
-- Created: 2015-04-24 18:26:51
-- Updated: 2015-04-24 18:26:51

CREATE VIEW "am.variant_pre_3" AS
SELECT
COALESCE(size_group_code_smcsl, size_group_code_smcbs, size_group_code_smcs ) AS "size_group_code",
COALESCE(size_erp_smcsl,size_erp_smcbs, size_erp_smcs) AS "size_erp",
v.*
FROM "am.variant_pre_2" v


