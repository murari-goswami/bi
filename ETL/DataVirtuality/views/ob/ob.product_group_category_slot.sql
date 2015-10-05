-- Name: ob.product_group_category_slot
-- Created: 2015-06-11 17:41:32
-- Updated: 2015-06-11 17:41:32

CREATE VIEW ob.product_group_category_slot AS
SELECT "csv_table".* FROM
(call "file".getFiles('product_group_category_slot.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"product_group_code" STRING,
		"flat_category" STRING,
		"outfit_slot" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


