-- Name: am.product_group_code
-- Created: 2015-04-24 18:17:52
-- Updated: 2015-04-24 18:17:52

CREATE VIEW am.product_group_code AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.product_group_code.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"Article Category" STRING ,
		"Product Group" STRING ,
		"Description" STRING 
		DELIMITER ',' 
		QUOTE '"' 
		HEADER 1 
	)
"csv_table"


