-- Name: bi.stock_levels_history
-- Created: 2015-05-22 16:50:33
-- Updated: 2015-06-30 18:25:55

CREATE view bi.stock_levels_history AS

/* this needs to run after the previous updates; so 00:40 */

SELECT 
	beg.date_created, 
	CAST(beg.article_id AS BIGINT) AS article_id,
	CAST(beg.quantity AS SMALLINT) AS stock_beg,
	CAST(beg.reserved AS SMALLINT) AS reserved_beg,
	CAST(ending.quantity AS SMALLINT) AS stock_end,
	CAST(ending.reserved AS SMALLINT) AS reserved_end
FROM
	( /* following is effectively the beginning numbers for a day;
		dwh.stock_entry_history has an insert performed daily at 00:30 */
		SELECT
			date_created,
			sku AS article_id,
			quantity AS quantity, 
			reserved AS reserved
		FROM dwh.stock_entry_history
	) AS beg
	
	JOIN
	/* following is effectively the ending numbers*/
	(	/* the snapshot is taken daily at 00:30 */
		SELECT 
			CURDATE() AS date_created,
			article_id,
			quantity AS quantity, 
			reserved AS reserved
		FROM 
			raw.stock_levels_daily_snapshot
		
		UNION
		/* dwh.stock_entry_history has an insert performed daily at 00:30 */
		SELECT 
			TIMESTAMPADD(SQL_TSI_DAY, -1, date_created) AS date_created,
			sku AS article_id,
			quantity AS quantity, 
			reserved AS reserved
		FROM 
			dwh.stock_entry_history
	) AS ending
		 ON beg.date_created = ending.date_created 
		AND beg.article_id	= ending.article_id
WHERE
		beg.article_id 		!= 'null'
	AND ending.article_id 	!= 'null'
	/*
	the following filter will remove 2/3 of the rows since that are all zeros; that's currently 20M/30M
	AND COALESCE(beg.quantity,0) + COALESCE(beg.reserved,0) + COALESCE(ending.quantity,0) + COALESCE(ending.reserved,0) > 0
	*/


