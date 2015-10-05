-- Name: ml.amidala_attributes
-- Created: 2015-04-24 18:17:46
-- Updated: 2015-04-24 18:17:46

CREATE VIEW ml.amidala_attributes AS
SELECT
att.id attribute_id,
att.identifier attribute_identifier,
prop.id property_id,
prop.identifier property_identifier,
att.name attribute_name
FROM
postgres.attribute att
JOIN postgres.property prop ON att.property_id = prop.id
WHERE att.active = 'true'


