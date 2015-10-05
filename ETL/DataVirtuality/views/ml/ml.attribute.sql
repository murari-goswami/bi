-- Name: ml.attribute
-- Created: 2015-04-24 18:17:43
-- Updated: 2015-04-24 18:17:43

CREATE VIEW ml.attribute AS
SELECT
att.id attribute_id,
prop.id property_id,
prop.identifier property_identifier,
att.identifier attribute_identifier,
att.name attribute_name
FROM
postgres.attribute att
JOIN postgres.property prop ON att.property_id = prop.id


