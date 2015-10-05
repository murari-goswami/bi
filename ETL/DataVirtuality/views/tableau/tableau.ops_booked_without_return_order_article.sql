-- Name: tableau.ops_booked_without_return_order_article
-- Created: 2015-06-24 14:20:58
-- Updated: 2015-09-28 17:32:03

CREATE VIEW tableau.ops_booked_without_return_order_article 
AS

WITH dataset7 as (
    WITH dataset6 as (
        WITH dataset5 as (
            WITH dataset3 as (
                WITH dataset2 as (
                    WITH dataset1 as (
                        SELECT
                                sb.article_id
                                ,sb.date_stock_booked
                                ,cal.day_name as day_name_date_stock_booked
                                ,MAX (
                                    CASE
                                        WHEN coal.date_returned < sb.date_stock_booked
                                        THEN coal.date_returned
                                    END
                                ) as date_last_return
                            FROM
                                bi.stock_booked sb LEFT JOIN bi.customer_order_articles_logistics coal
                                on coal.article_id = sb.article_id LEFT JOIN dwh.calendar cal
                                on cal.date = sb.stock_booking_date
                            WHERE
                                sb.supplier_id = 999997
                            GROUP BY
                                1
                                ,2
                                ,3
                    ) SELECT
                            dataset1.*
                            ,coal2.order_id
                            ,coal2.date_returned as date_article_returned
                            ,co.date_returned as date_customer_order_returned
                            ,co.shipping_country
                        From
                            dataset1 LEFT JOIN bi.customer_order_articles_logistics coal2
                            on dataset1.article_id = coal2.article_id LEFT JOIN bi.customer_order co
                            on co.order_id = coal2.order_id
                        WHERE
                            coal2.date_returned is null
                            AND co.date_returned is not null
                ) SELECT
                        dataset2.*
                        ,coa.date_returned_online
                        ,coa.date_returned as date_article_returned_grails
                        ,coa.date_lost as date_article_lost_grails
                    FROM
                        dataset2 LEFT JOIN bi.customer_order_articles coa
                        on coa.order_id = dataset2.order_id
                        AND coa.article_id = dataset2.article_id
            ) SELECT
                    dataset3.*
                    ,CASE
                        WHEN dataset3.day_name_date_stock_booked = 'Monday'
                        OR dataset3.day_name_date_stock_booked = 'Tuesday'
                        OR dataset3.day_name_date_stock_booked = 'Wednesday'
                        OR dataset3.day_name_date_stock_booked = 'Thursday'
                        THEN - 7
                        ELSE - 7
                    END
                    As days_to_count_from_stock_booked
                FROM
                    dataset3
        ) SELECT
                dataset5.article_id
                ,dataset5.date_stock_booked
                ,dataset5.day_name_date_stock_booked
                ,dataset5.days_to_count_from_stock_booked
                ,TIMESTAMPADD (
                    SQL_TSI_Day
                    ,days_to_count_from_stock_booked
                    ,cast (
                        date_stock_booked as date
                    )
                ) as date_stock_booked_minus_1_week
                ,dataset5.date_last_return
                ,dataset5.order_id
                ,dataset5.date_article_returned
                ,dataset5.date_customer_order_returned
                ,dataset5.date_returned_online
                ,dataset5.shipping_country
                ,dataset5.date_article_returned_grails
                ,dataset5.date_article_lost_grails
            FROM
                dataset5
            GROUP BY
                1
                ,2
                ,3
                ,4
                ,6
                ,7
                ,8
                ,9
                ,10
                ,11
                ,12
                ,13
    ) SELECT
            dataset6.article_id
            ,dataset6.date_stock_booked
            ,dataset6.date_stock_booked_minus_1_week
            ,dataset6.date_last_return
            ,dataset6.order_id
            ,dataset6.date_article_returned
            ,dataset6.date_customer_order_returned
            ,dataset6.date_returned_online
            ,dataset6.shipping_country
            ,dataset6.date_article_returned_grails
            ,dataset6.date_article_lost_grails
        FROM
            dataset6
        WHERE
            cast (
                date_last_return as date
            ) < date_stock_booked_minus_1_week
            AND cast (
                date_customer_order_returned as date
            ) >= date_stock_booked_minus_1_week
            AND cast (
                date_customer_order_returned as date
            ) >= date_stock_booked_minus_1_week
            AND cast (
                date_customer_order_returned as date
            ) <= date_stock_booked
            AND dataset6.shipping_country <> 'CH'
            AND dataset6.date_stock_booked > dataset6.date_customer_order_returned
        ORDER BY
            2 desc
            ,1 desc
) SELECT
		dataset7.order_id,
		dataset7.article_id,
   		dataset7.date_stock_booked_minus_1_week,
   		oc.comment
    FROM
        dataset7 
        JOIN 
        (
        	SELECT 
				order_id,
				comment
			FROM "raw.order_comment" oc
			WHERE 
			comment LIKE '%manuell%' OR
			comment LIKE '%Retoure%' OR
			comment LIKE '%retourniert%'
			AND 
			(LOWER(comment) NOT LIKE '%manuell retourniert%' OR LOWER(comment) NOT LIKE '%manuell retourniert%'
		 	OR LOWER(comment) NOT LIKE '%manuelle retoure%')
        ) oc on oc.order_id=dataset7.order_id
        LEFT JOIN bi.customer_order co3
        on YEAR (co3.date_returned) = YEAR (dataset7.date_stock_booked_minus_1_week)
        AND MONTH (co3.date_returned) = MONTH (dataset7.date_stock_booked_minus_1_week)
    WHERE
        co3.shipping_country <> 'CH'
    GROUP BY 1,2,3,4


