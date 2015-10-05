-- Name: am.unit_pim__pieces_erp
-- Created: 2015-04-24 18:17:58
-- Updated: 2015-04-24 18:17:58

CREATE VIEW am.unit_pim__pieces_erp AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.piece.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"unit_pim" STRING ,
		"pieces_erp" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


