-- Name: am.color_mapping_new
-- Created: 2015-05-20 15:45:31
-- Updated: 2015-05-20 15:45:31

CREATE VIEW "am.color_mapping_new" AS
SELECT
"csv_table.color1",
"csv_table.color_code_erp" 
FROM
(call "file".getFiles('am.color_mapping_new.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"color1" STRING ,
		"color_code_erp" STRING 
		DELIMITER ',' 
		QUOTE '"' 
		HEADER 1 
	)
"csv_table"


