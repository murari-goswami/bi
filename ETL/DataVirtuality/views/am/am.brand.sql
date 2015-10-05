-- Name: am.brand
-- Created: 2015-04-24 18:17:58
-- Updated: 2015-04-24 18:17:58

CREATE VIEW am.brand AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.brand.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"brand_pim" STRING ,
		"brand_erp" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


