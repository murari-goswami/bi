-- Name: sandbox.item_model_checks
-- Created: 2015-06-29 14:02:07
-- Updated: 2015-06-29 14:02:07

CREATE VIEW sandbox.item_model_checks AS
SELECT 1
/*

I've been running these to check for duplicates, etc.

SELECT COUNT(*), count(distinct "article_id"), count(distinct "supplier_article_id"), count(distinct "item_no"|| "variant_code") FROM "postgres.article_item_variant"
--------------------
SELECT 
	COUNT(*) row_cnt, 
	count(distinct "supplier_article_id") supplier_article_ids,
	count(case when "supplier_article_id" is null then 1 end) null_supplier_article_ids,	
	count(case when "article_id" is null then 1 end) null_article_id, 
	count(distinct case when "article_id" is not null then article_id end) not_null_article_id, 
 	count(case when "item_no"|| "variant_code" is null then 1 end) null_item_no_variant,
 	count(distinct case when "item_no"|| "variant_code" is not null then "item_no"|| "variant_code" end) not_null_item_no_variant,
 	count(case when ean is null then 1 end) null_eans,
 	count(distinct case when ean is not null then ean end) not_null_eans
FROM "bi.item"
-------------
select * 
from "raw.ami_article_item_variant" a
	join
	(
	SELECT "item_no", "variant_code" FROM "raw.ami_article_item_variant"
	group by 1,2
	having count(*)>1
	) y
	 on a.item_no=y.item_no
	and a.variant_code = y.variant_code
order by 3,4
-------------
SELECT "item_no", "variant_code" FROM "bi.item"
group by 1,2
having count(*)>1
-------------------
select item_no||variant_code, count(*)
from "raw.nav_item" 
group by 1
order by 2 desc
---------------------------
select * from "postgres.supplier_article" where article_id in (32711252,32683255)
*/


