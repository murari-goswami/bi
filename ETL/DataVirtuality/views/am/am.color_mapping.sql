-- Name: am.color_mapping
-- Created: 2015-04-24 18:18:01
-- Updated: 2015-04-27 14:53:35

CREATE VIEW "am.color_mapping" AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.color_mapping.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"pim_model_id" STRING ,
		"brand" STRING ,
		"supplier_color_code" STRING ,
		"color1" STRING ,
		"color_code_erp" STRING ,
		"key" STRING 
		DELIMITER ',' 
		QUOTE '"' 
		HEADER 1 
	)
"csv_table"


