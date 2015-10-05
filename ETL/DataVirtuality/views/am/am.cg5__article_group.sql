-- Name: am.cg5__article_group
-- Created: 2015-04-24 18:17:59
-- Updated: 2015-04-24 18:17:59

CREATE VIEW am.cg5__article_group AS
SELECT "csv_table".* FROM
(call "file".getFiles('am.cg5__article_group.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"commodity_group5" STRING ,
		"article_category" STRING ,
		"product_group" STRING 
		DELIMITER ',' 
		QUOTE '''' 
		HEADER 1 
	)
"csv_table"


