-- Name: am.mapping_commodity_groups
-- Created: 2015-04-24 18:17:52
-- Updated: 2015-04-24 18:17:52

CREATE VIEW am.mapping_commodity_groups AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.20150327_mapping_commodity_groups.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"commodity_group5" STRING ,
		"Artikelkategoriencode" STRING ,
		"Code" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


