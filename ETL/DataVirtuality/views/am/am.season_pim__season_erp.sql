-- Name: am.season_pim__season_erp
-- Created: 2015-04-24 18:17:59
-- Updated: 2015-04-24 18:17:59

CREATE VIEW am.season_pim__season_erp AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.season.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"season_pim" STRING ,
		"season_erp" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


