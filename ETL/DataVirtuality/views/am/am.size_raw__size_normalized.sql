-- Name: am.size_raw__size_normalized
-- Created: 2015-04-24 18:18:01
-- Updated: 2015-04-24 18:18:01

CREATE VIEW "am.size_raw__size_normalized" AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.size_normalization.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"eu_size" STRING ,
		"eu_size_normed" STRING ,
		"bad" STRING 
		DELIMITER ',' 
		QUOTE '"' 
		HEADER 1 
	)
"csv_table"


