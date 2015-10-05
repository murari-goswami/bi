-- Name: raw.supplier_article
-- Created: 2015-06-29 15:10:24
-- Updated: 2015-06-30 12:29:26

CREATE VIEW raw.supplier_article AS 

SELECT
	"id", "version", "article_id", "date_created", "last_updated", "retail_price", "sku", "supplier_id", "purchase_price", "quantity", 
	LEFT(CAST("data" AS STRING),4000) data, "active", "ean", "image_url", "partner_shop_url", "manufacturer_sku"

FROM
	postgres.supplier_article


