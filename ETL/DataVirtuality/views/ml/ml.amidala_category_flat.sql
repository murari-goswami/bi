-- Name: ml.amidala_category_flat
-- Created: 2015-04-24 18:17:46
-- Updated: 2015-04-24 18:17:46

CREATE VIEW ml.amidala_category_flat AS
SELECT "csv_table".* FROM
(call "file".getFiles('ml_amidala_category_flat.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"attribute_id" STRING ,
		"flat_category" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


