-- Name: am.size_mapping_new_with_code
-- Created: 2015-04-29 18:27:56
-- Updated: 2015-04-29 18:27:56

CREATE VIEW am.size_mapping_new_with_code AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.size_mapping_new_with_code.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"commodity_group4" STRING ,
		"brand" STRING ,
		"eu_size" STRING ,
		"eu_length" STRING ,
		"Size Group Code" STRING ,
		"Description" STRING ,
		"eu_size_x_length" STRING ,
		"size_code" STRING 
		DELIMITER ',' 
		QUOTE '"' 
		HEADER 1 
	)
"csv_table"


