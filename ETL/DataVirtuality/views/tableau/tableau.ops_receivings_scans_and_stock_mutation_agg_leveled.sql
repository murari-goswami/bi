-- Name: tableau.ops_receivings_scans_and_stock_mutation_agg_leveled
-- Created: 2015-04-24 18:20:32
-- Updated: 2015-04-24 18:20:32

CREATE view tableau.ops_receivings_scans_and_stock_mutation_agg_leveled 
AS
WITH stock_mutation AS
(
    SELECT 
        row_number() over (partition by purchase_order_id, article_id order by d asc) AS "rnum",
        cast(d||'00' AS timestamp) AS booking_day,
        article_id,
        purchase_order_id,
        c AS booking_count,
        dc_min AS min_date_created,
        dc_max AS max_date_created
    FROM
    (
        SELECT 
            purchase_order_id,
            article_id,
            left(date_stock_booked, 14) AS d,
            count(*) AS c,
            max(date_stock_booked) AS dc_max ,
            min(date_stock_booked) AS dc_min 
        FROM bi.stock_booked
        WHERE purchase_order_id <> '' 
        GROUP BY 1,2,3
    )a
)
SELECT 
    poa.purchase_order_id as po,
    poa.article_ean as ean,
    poa.article_id,
    poa.stock_scanned as count_scans,
    poa.stock_scanned_photo_articles as count_photo_article, 
    poa.stock_scanned_ean_unknown_articles as count_ean_unknown, 
    poa.stock_scanned_overdelivered_articles as count_overdelivered, 
    poa.date_stock_handedover_min as min_date_given_to_serviceprovider, 
    poa.date_stock_handedover_max as max_date_given_to_serviceprovider,  
    poa.stock_ordered_revised as quantity, 
    poa.stock_ordered_initially as initial_quantity, 
    poa.stock_booked as fulfilled_quantity, 
    countsm.daycount,
    sm1.booking_count AS booking_count1,
    sm1.booking_day AS booking_part1,
    sm1.min_date_created AS min1,
    sm1.max_date_created AS max1,
    sm2.booking_count AS booking_count2,
    sm2.booking_day AS booking_part2, 
    sm2.min_date_created AS min2,
    sm2.max_date_created AS max2,
    sm3.booking_count AS booking_count3, 
    sm3.booking_day AS booking_part3, 
    sm3.min_date_created AS min3, 
    sm3.max_date_created AS max3,
    sm4.booking_count AS booking_count4, 
    sm4.booking_day AS booking_part4,
    sm4.min_date_created AS min4,
    sm4.max_date_created AS max4,
    sm5.booking_count AS booking_count5,
    sm5.booking_day AS booking_part5,
    sm5.min_date_created AS min5,
    sm5.max_date_created AS max5,
    sm6.booking_count AS booking_count6,
    sm6.booking_day AS booking_part6,
    sm6.min_date_created AS min6,
    sm6.max_date_created AS max6,
    sm7.booking_count AS booking_count7,
    sm7.booking_day AS booking_part7,
    sm7.min_date_created AS min7,
    sm7.max_date_created AS max7
FROM bi.purchase_order_articles poa  
LEFT JOIN
(
 SELECT 
        purchase_order_id,
        article_id,
        count(distinct cast(date_stock_booked AS date)) AS daycount 
    FROM bi.stock_booked
    GROUP BY 1,2
) countsm ON countsm.purchase_order_id = poa.purchase_order_id AND countsm.article_id =poa.article_id
LEFT JOIN stock_mutation sm1 ON sm1.article_id = poa.article_id AND sm1.purchase_order_id = poa.purchase_order_id AND sm1.rnum = 1
LEFT JOIN stock_mutation sm2 ON sm2.article_id = poa.article_id AND sm2.purchase_order_id = poa.purchase_order_id AND sm2.rnum = 2
LEFT JOIN stock_mutation sm3 ON sm3.article_id = poa.article_id AND sm3.purchase_order_id = poa.purchase_order_id AND sm3.rnum = 3 
LEFT JOIN stock_mutation sm4 ON sm4.article_id = poa.article_id AND sm4.purchase_order_id = poa.purchase_order_id AND sm4.rnum = 4
LEFT JOIN stock_mutation sm5 ON sm5.article_id = poa.article_id AND sm5.purchase_order_id = poa.purchase_order_id AND sm5.rnum = 5
LEFT JOIN stock_mutation sm6 ON sm6.article_id = poa.article_id AND sm6.purchase_order_id = poa.purchase_order_id AND sm6.rnum = 6
LEFT JOIN stock_mutation sm7 ON sm7.article_id = poa.article_id AND sm7.purchase_order_id = poa.purchase_order_id AND sm7.rnum = 7


