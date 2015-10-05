-- Name: raw.nav_item_materials
-- Created: 2015-06-26 14:10:43
-- Updated: 2015-07-30 12:20:12

CREATE VIEW raw.nav_item_materials 
AS

SELECT
	"Item No_" AS item_no,
	imat."Material Code" AS material_code,
	imat."Quantity _" as quantity,
	mat.description AS material
FROM

	"nav_test.Outfittery GmbH$Item Material" imat
	LEFT JOIN
	"nav_test.Outfittery GmbH$Material" mat
		 ON imat."material code" = mat.code


