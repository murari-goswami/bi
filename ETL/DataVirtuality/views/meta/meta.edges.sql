-- Name: meta.edges
-- Created: 2015-04-24 18:19:28
-- Updated: 2015-04-24 18:19:28

CREATE VIEW meta.edges AS
SELECT
edges_raw.child "child",
edges_raw.parent "parent"
FROM
( SELECT DISTINCT
dependentResourceName AS "child",
parentResourceName AS "parent"
FROM "meta.schemas"
WHERE
( dependentResourceType = 'VIEW' OR dependentResourceType = 'TABLE' )
AND
( parentResourceType = 'VIEW' OR parentResourceType = 'TABLE' ) ) "edges_raw"
INNER JOIN "meta.nodes" ON meta.nodes.node = edges_raw.child
INNER JOIN "meta.nodes" n2 ON n2.node = edges_raw.parent


