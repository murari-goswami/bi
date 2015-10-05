-- Name: am.brand_pim__blacklisted_countries
-- Created: 2015-04-24 18:17:58
-- Updated: 2015-04-24 18:17:58

CREATE VIEW am.brand_pim__blacklisted_countries AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.blacklist.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"brand_pim" STRING ,
		"blacklisted_countries" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


