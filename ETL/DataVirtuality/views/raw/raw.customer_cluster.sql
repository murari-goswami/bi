-- Name: raw.customer_cluster
-- Created: 2015-08-05 09:21:52
-- Updated: 2015-08-05 09:21:52

CREATE VIEW raw.customer_cluster
AS

/*This view has current status of customer if the customer is active or passive*/
SELECT 
	customer_id,
	cluster,
	level_1,
	"date"
FROM
(
	SELECT 
		ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY "date" DESC) AS rank_cust,
		customer_id,
		"date",
		cluster, 
		level_1
	FROM mlpg.customer_states
)a
WHERE rank_cust=1


