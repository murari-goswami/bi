-- Name: tableau.bisdev_nps_3months
-- Created: 2015-04-29 11:00:01
-- Updated: 2015-04-29 11:00:01

CREATE VIEW tableau.bisdev_nps_3months
AS

SELECT 
 	sty.stylist,
  	SUM(CASE WHEN co.nps_score >= 9 AND co.nps_score <= 10 THEN 1 ELSE 0 END) AS nr_of_promoters,
  	SUM(CASE WHEN co.nps_score >= 0 AND co.nps_score <= 6 THEN 1 ELSE 0 END) AS nr_of_detractors,
  	SUM(CASE WHEN co.nps_score IS NULL THEN 0 ELSE 1 END) AS nr_of_times_each_score
FROM bi.customer_order co 
left join bi.stylist sty on co.stylist_id = sty.stylist_id
WHERE cast(co.date_nps_submitted as date)>= timestampadd(SQL_TSI_MONTH,-3,curdate())
GROUP BY 1


