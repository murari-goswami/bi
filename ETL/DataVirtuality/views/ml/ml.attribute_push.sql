-- Name: ml.attribute_push
-- Created: 2015-04-24 18:17:53
-- Updated: 2015-04-24 18:17:53

CREATE VIEW ml.attribute_push AS
SELECT
    a.id AS attribute_id,
    a.identifier AS attribute_identifier
FROM postgres.attribute AS a
LEFT JOIN postgres.property AS p
    ON p.id = a.property_id
WHERE p.id = 60716143
ORDER BY a.id ASC


