-- Name: ml.flat_brand_properties
-- Created: 2015-04-24 18:17:47
-- Updated: 2015-04-24 18:17:47

CREATE VIEW ml.flat_brand_properties AS
SELECT "csv_table".* FROM
(call "file".getFiles('flat_brand_properties.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"flat_brand" STRING,
		"brand_over_40" INTEGER,
		"brand_under_40" INTEGER,
		"price_high"  INTEGER,
		"price_medium" INTEGER,
		"price_low" INTEGER
		DELIMITER ',' 
		HEADER 1 
	)
"csv_table"


