-- Name: tableau.ops_inbound_SLA_dates
-- Created: 2015-04-24 18:20:51
-- Updated: 2015-04-24 18:20:51

CREATE view tableau.ops_inbound_SLA_dates
as 
select
    scan.rnum_scan,
    scan.article_ean as ean,
    scan.photo_article,
    scan.overdelivered, 
    scan.hanging,
    scan.article_id,
    scan.date_stock_delivered as date_delivered,
    scan.date_stock_uploaded as date_uploaded,
    scan.date_stock_scanned as date_scanned,
    scan.date_stock_handedover as date_given_to_serviceprovi,
    scan.purchase_order_id as po,
    sm.rnum_sm, 
    pim.brand,
    sm.date_stock_booked as date_created
FROM 
(
    SELECT 
        row_number() over (partition by sc.purchase_order_id, sc.article_ean order by date_stock_scanned asc) AS "rnum_scan",
        sc.purchase_order_id, 
        sc.article_ean, 
        CASE 
            WHEN sc.scan_photo_article = 'JA' then 1 
            ELSE 0 
        end AS photo_article,
        CASE 
            WHEN sc.scan_article_overdelivered = 'JA' then 1 
            ELSE 0 
        end AS overdelivered,
        CASE 
            WHEN sc.scan_garment = 'JA' then 1 
            ELSE 0 
        end AS hanging, 
        sc.date_stock_delivered,
        sc.date_stock_uploaded,
        sc.date_stock_scanned,
        sc.date_stock_handedover,
        poa.article_id
    FROM raw.stock_scanned sc
    INNER JOIN bi.purchase_order_articles poa ON poa.article_ean = sc.article_ean and sc.purchase_order_id = poa.purchase_order_id
    WHERE CAST(sc.date_stock_delivered AS date) > '2014-08-13'
) AS scan 
LEFT JOIN
(
    SELECT 
        row_number() over (partition by purchase_order_id, article_id order by date_stock_booked asc) AS "rnum_sm",
        purchase_order_id,
        article_id,
        date_stock_booked 
    FROM bi.stock_booked
    WHERE purchase_order_id <> '' and CAST(date_stock_booked AS date) > '2014-08-13'
) AS sm ON sm.article_id = scan.article_id and sm.purchase_order_id = scan.purchase_order_id and scan.rnum_scan = sm.rnum_sm
LEFT JOIN 
(
    SELECT 
        ean,
        brand 
    FROM raw.article_detail_pim
) AS pim ON pim.ean = scan.article_ean


