-- Name: ob.molor
-- Created: 2015-06-11 14:20:02
-- Updated: 2015-07-08 14:00:48

CREATE VIEW ob.molor AS
SELECT
    molor_id,
    article_id AS article_id_arbitrary,
    category,
    product_group,
    flat_category,
    outfit_slot__belt,
    outfit_slot__headwear,
    outfit_slot__jacket,
    outfit_slot__neckwear,
    outfit_slot__over_shirt,
    outfit_slot__shirt,
    outfit_slot__shoes,
    outfit_slot__socks,
    outfit_slot__suit,
    outfit_slot__tie,
    outfit_slot__trousers,
    outfit_slot__underwear,
    outfit_slot__gloves,
    outfit_slot__swimwear,
    sales_price_de
    FROM
    (SELECT
        item_details.*,
        ROW_NUMBER() OVER (PARTITION BY item_details.molor_id
                           ORDER BY item_details.article_id) AS rank
        FROM
        (SELECT
        item.article_id AS article_id,
        am.molor_id,
        item.category,
        item.product_group,
        slot.flat_category,
        cast(slot.outfit_slot = 'belt' AS integer) AS "outfit_slot__belt",
        cast(slot.outfit_slot = 'headwear' AS integer) AS "outfit_slot__headwear",
        cast(slot.outfit_slot = 'jacket' AS integer) AS "outfit_slot__jacket",
        cast(slot.outfit_slot = 'neckwear' AS integer) AS "outfit_slot__neckwear",
        cast(slot.outfit_slot = 'over_shirt' AS integer) AS "outfit_slot__over_shirt",
        cast(slot.outfit_slot = 'shirt' AS integer) AS "outfit_slot__shirt",
        cast(slot.outfit_slot = 'shoes' AS integer) AS "outfit_slot__shoes",
        cast(slot.outfit_slot = 'socks' AS integer) AS "outfit_slot__socks",
        cast(slot.outfit_slot = 'suit' AS integer) AS "outfit_slot__suit",
        cast(slot.outfit_slot = 'tie' AS integer) AS "outfit_slot__tie",
        cast(slot.outfit_slot = 'trousers' AS integer) AS "outfit_slot__trousers",
        cast(slot.outfit_slot = 'underwear' AS integer) AS "outfit_slot__underwear",
        cast(slot.outfit_slot = 'gloves' AS integer) AS "outfit_slot__gloves",
        cast(slot.outfit_slot = 'swimwear' AS integer) AS "outfit_slot__swimwear",
        item.unit_price_de as sales_price_de
        FROM "bi.item" AS item
        LEFT JOIN "ob.product_group_category_slot" slot
        	ON item.product_group_code = slot.product_group_code
        INNER JOIN "ob.article__molor" am
        	ON item.article_id = am.article_id)
        AS item_details)
    AS item_rank
WHERE item_rank.rank = 1
	AND item_rank.molor_id IS NOT NULL
ORDER BY item_rank.molor_id


