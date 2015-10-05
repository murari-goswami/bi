-- Name: am.bad_apples_base
-- Created: 2015-04-24 18:22:21
-- Updated: 2015-04-24 18:22:21

CREATE VIEW am.bad_apples_base AS
SELECT * FROM "am.base"
WHERE
product_group IS NULL
OR
article_category IS NULL
or
brand_erp IS NULL
or
pieces IS NULL
or
article_name IS NULL


