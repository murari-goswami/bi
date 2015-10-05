-- Name: meta.nodes
-- Created: 2015-04-24 18:17:58
-- Updated: 2015-04-24 18:17:58

CREATE VIEW meta.nodes AS
SELECT
SchemaName || '.' || Name AS "node",
SchemaName "schema"
FROM "SYS.Tables"
WHERE SchemaName in ( 'am', 'analytics', 'bi', 'dhltracking', 'ml', 'pim', 'postgres', 'raw', 'salesforce', 'snowplow', 'tableau', 'views' )


