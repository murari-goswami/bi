-- Name: ml.flat_brand_bi_brand
-- Created: 2015-04-24 18:17:47
-- Updated: 2015-04-24 18:17:47

CREATE VIEW ml.flat_brand_bi_brand AS
SELECT "csv_table".* FROM
(call "file".getFiles('bi_brand_flat.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"flat_brand" STRING,
		"bi_brand" STRING 
		DELIMITER ',' 
		HEADER 1 
	)
"csv_table"


