-- Name: ml.flat_category
-- Created: 2015-04-24 18:17:46
-- Updated: 2015-04-24 18:17:46

CREATE VIEW ml.flat_category AS
SELECT "csv_table".* FROM
(call "file".getFiles('ml_flat_category.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"flat_category" STRING ,
		"outfit_slot" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


