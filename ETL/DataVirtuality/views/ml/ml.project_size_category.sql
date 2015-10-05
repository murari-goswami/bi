-- Name: ml.project_size_category
-- Created: 2015-04-24 18:17:49
-- Updated: 2015-04-24 18:17:49

CREATE VIEW ml.project_size_category AS
SELECT "csv_table".* FROM
(call "file".getFiles('ml_project_size_category.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"attribute_id_size" STRING ,
		"attribute_id_category" STRING ,
		"count" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


