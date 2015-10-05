-- Name: meta.schemas
-- Created: 2015-04-24 18:19:20
-- Updated: 2015-04-24 18:19:20

CREATE VIEW meta.schemas AS
SELECT * FROM "meta.schema__am"
UNION
SELECT * FROM "meta.schema__bi"
UNION
SELECT * FROM "meta.schema__ml"
UNION
SELECT * FROM "meta.schema__raw"
UNION
SELECT * FROM "meta.schema__tableau"
UNION
SELECT * FROM "meta.schema__views"
UNION
SELECT * FROM "meta.schema__postgres"
UNION
SELECT * FROM "meta.schema__pim"
UNION
SELECT * FROM "meta.schema__salesforce"
UNION
SELECT * FROM "meta.schema__snowplow"
UNION
SELECT * FROM "meta.schema__dhltracking"
UNION
SELECT * FROM "meta.schema__analytics"


