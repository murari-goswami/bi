-- Name: am.brand_pim__creditor
-- Created: 2015-04-28 18:45:17
-- Updated: 2015-04-28 18:45:17

CREATE VIEW am.brand_pim__creditor AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.brand_pim__creditor.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"brand_pim" STRING ,
		"creditor" STRING 
		DELIMITER ',' 
		QUOTE '"' 
		HEADER 1 
	)
"csv_table"


