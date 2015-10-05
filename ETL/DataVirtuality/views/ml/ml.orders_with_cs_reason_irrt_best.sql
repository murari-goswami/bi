-- Name: ml.orders_with_cs_reason_irrt_best
-- Created: 2015-06-09 17:47:51
-- Updated: 2015-06-09 17:47:51

CREATE VIEW ml.orders_with_cs_reason_irrt_best AS
SELECT
"csv_table.EXTERNALORDERID__C" AS "order_id"
FROM
(call "file".getFiles('20150609_orders_with_cs_reason_irrt_best.csv')) f,
	TEXTTABLE(to_chars(f.file,'UTF-8') 
		COLUMNS 
		"ID" STRING ,
		"EXTERNALORDERID__C" STRING ,
		"CS_REASON__C" STRING 
		DELIMITER ',' 
		QUOTE '"' 
		HEADER 1 
	)
"csv_table"


