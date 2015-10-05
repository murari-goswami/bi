-- Name: raw.customer_order_articles
-- Created: 2015-04-24 18:17:16
-- Updated: 2015-04-24 18:17:16

CREATE VIEW raw.customer_order_articles
as
SELECT 
	op.id as order_position_id,
	op.order_id,
	op.group_id,
	op.order_id || '_' || op.group_id as outfit_id,
	op.article_id,
	op.stock_location_id,
	op.supplier_article_id,
	op.supplier_order_number,
	op.track_and_trace_number,
	op.order_positions_idx as order_position_count,
	CASE 
		WHEN co.state = 2048 THEN 'Cancelled'
		WHEN op.state = 8 THEN 'Placed'
		WHEN op.state >= 16  AND op.state < 128 THEN 'Packing'    /*WHEN op.state = 32 THEN 'Stocked' WHEN op.state = 64 THEN 'Placed'*/
		WHEN op.state >= 128 AND op.state < 512 THEN 'Sent'       /*WHEN op.state = 256 THEN 'Arrived' WHEN op.state = 384 THEN 'Returned Online'*/
		WHEN op.state = 512 THEN 'Returned'
		WHEN op.state = 1024 THEN 'Kept'
		WHEN op.state = 1536 THEN 'Lost'
		WHEN op.state = 2048 THEN 'Cancelled'
		ELSE 'Unknown'
	END as order_article_state,
	op.state as order_article_state_number,
	CASE WHEN NOT (op.retail_price = 0 AND sa.article_id is not null) AND op.state >= 16 AND op.state < 2048 THEN op.quantity ELSE null END as articles_picked,
	CASE WHEN NOT (op.retail_price = 0 AND sa.article_id is not null) AND op.state >= 128 AND op.state < 2048 THEN op.quantity ELSE null END as articles_sent,
	CASE WHEN NOT (op.retail_price = 0 AND sa.article_id is not null) AND op.state = 1024 THEN op.quantity ELSE null END as articles_kept,
	CASE WHEN NOT (op.retail_price = 0 AND sa.article_id is not null) AND op.state = 512  THEN op.quantity ELSE null END as articles_returned,
	CASE WHEN NOT (op.retail_price = 0 AND sa.article_id is not null) AND op.state = 1536 THEN op.quantity ELSE null END as articles_lost,
	op.retail_price as sales_in_local_currency,  /* In local currency */
	op.purchase_price as cost,  /* In EUR */
	op.date_created,
	op.date_picked,
	op.date_canceled as date_cancelled,
	op.date_returned,
	op.date_shipped,
	op.date_incoming,
	op.date_returned_online,
	op.date_lost, 
	feedback_case.feedback_good_colour,
	feedback_case.feedback_good_quality,
	feedback_case.feedback_good_match_to_customers_style,
	feedback_case.feedback_dont_like_style,
	feedback_case.feedback_good_fit,	
	feedback_case.feedback_bad_fit,
	feedback_case.feedback_too_big,
	feedback_case.feedback_too_small,
	feedback_case.feedback_too_short,
	feedback_case.feedback_too_long,
	feedback_case.feedback_too_tight,
	feedback_case.feedback_too_wide,
	feedback_case.feedback_too_outrageous,
	feedback_case.feedback_too_simple,
	feedback_case.feedback_too_cheap,
	feedback_case.feedback_too_expensive,
	feedback_case.feedback_too_low_quality,
	feedback_case.feedback_dont_like_the_brand,
	feedback_case.feedback_dont_like_the_pattern,
	feedback_case.feedback_dont_like_the_colour,
	feedback_case.feedback_not_needed,
	feedback_case.feedback_would_like_to_try_something_new,	
	feedback_case.feedback_damaged,
	feedback_case.feedback_was_dirty,
	feedback_case.feedback_late_delivery,	
	feedback_case.feedback_fraud,
	cm.feedback_comment	
FROM postgres.order_position op
JOIN postgres.customer_order co on co.id = op.order_id
/* Need to join to supplier article to check if articles are gifts. It needs to be a subselect due to duplicates in the table */
LEFT JOIN (
	SELECT
		sa.article_id
	FROM postgres.supplier_article sa 
	WHERE sa.supplier_id = 15
	GROUP BY sa.article_id
) sa on sa.article_id = op.article_id
LEFT JOIN (
	SELECT 
		ddr.original_orderid as order_id, 
		ddr.outfittery_article_number as article_id, 
		LOWER(MAX(ddr.comment)) as feedback_comment
	FROM postgres.doc_data_return ddr
	WHERE ddr.comment is not null 
	AND ddr.comment != ''
	GROUP BY 1,2
 	) cm ON op.order_id = cm.order_id AND op.article_id = cm.article_id
LEFT JOIN (
	SELECT
		fd.order_position_id,
		/* NOTE: Feedback reasons are ordered by feedback_reason_id here to make it easier to compare to postgres.feedback_reason */
		MAX(CASE WHEN fd.feedback_reason_id = '380476' THEN 1 ELSE null END)  as feedback_dont_like_the_brand,
		MAX(CASE WHEN fd.feedback_reason_id in ('380477', '1426276') THEN 1 ELSE null END) as feedback_too_big,
		MAX(CASE WHEN fd.feedback_reason_id in ('380478', '1426275') THEN 1 ELSE null END) as feedback_too_small,
		MAX(CASE WHEN fd.feedback_reason_id = '380479' THEN 1 ELSE null END)  as feedback_too_expensive,
		MAX(CASE WHEN fd.feedback_reason_id = '380482' THEN 1 ELSE null END)  as feedback_not_needed,
		MAX(CASE WHEN fd.feedback_reason_id = '380483' THEN 1 ELSE null END)  as feedback_damaged,
		MAX(CASE WHEN fd.feedback_reason_id = '412965' THEN 1 ELSE null END)  as feedback_late_delivery,
		MAX(CASE WHEN fd.feedback_reason_id in ('412966', '1426274') THEN 1 ELSE null END) as feedback_too_long,
		MAX(CASE WHEN fd.feedback_reason_id in ('412967', '1426277') THEN 1 ELSE null END) as feedback_too_short,
		MAX(CASE WHEN fd.feedback_reason_id in ('412968', '1426273') THEN 1 ELSE null END) as feedback_too_tight,
		MAX(CASE WHEN fd.feedback_reason_id in ('412969', '1426272') THEN 1 ELSE null END) as feedback_too_wide,
		MAX(CASE WHEN fd.feedback_reason_id = '539682' THEN 1 ELSE null END)  as feedback_too_simple,
		MAX(CASE WHEN fd.feedback_reason_id = '1126870' THEN 1 ELSE null END) as feedback_too_cheap,
		MAX(CASE WHEN fd.feedback_reason_id = '1295094' THEN 1 ELSE null END) as feedback_good_colour,
		MAX(CASE WHEN fd.feedback_reason_id = '1295097' THEN 1 ELSE null END) as feedback_good_fit,
		MAX(CASE WHEN fd.feedback_reason_id = '1295099' THEN 1 ELSE null END) as feedback_good_match_to_customers_style,
		MAX(CASE WHEN fd.feedback_reason_id = '1295102' THEN 1 ELSE null END) as feedback_good_quality,
		MAX(CASE WHEN fd.feedback_reason_id = '1295105' THEN 1 ELSE null END) as feedback_would_like_to_try_something_new,
		MAX(CASE WHEN fd.feedback_reason_id = '1296049' THEN 1 ELSE null END) as feedback_too_outrageous,
		MAX(CASE WHEN fd.feedback_reason_id = '1296060' THEN 1 ELSE null END) as feedback_too_low_quality,
		MAX(CASE WHEN fd.feedback_reason_id = '1361878' THEN 1 ELSE null END) as feedback_dont_like_style,
		/* These are merged into the original feedbacks as they are no longer really used
		MAX(CASE WHEN fd.feedback_reason_id = '1426272' THEN 1 ELSE null END) as feedback_too_wide_reorder,
		MAX(CASE WHEN fd.feedback_reason_id = '1426273' THEN 1 ELSE null END) as feedback_too_tight_reorder,
		MAX(CASE WHEN fd.feedback_reason_id = '1426274' THEN 1 ELSE null END) as feedback_too_long_reorder,
		MAX(CASE WHEN fd.feedback_reason_id = '1426275' THEN 1 ELSE null END) as feedback_too_small_reorder,
		MAX(CASE WHEN fd.feedback_reason_id = '1426276' THEN 1 ELSE null END) as feedback_too_big_reorder,
		MAX(CASE WHEN fd.feedback_reason_id = '1426277' THEN 1 ELSE null END) as feedback_too_short_reorder,
		*/
		MAX(CASE WHEN fd.feedback_reason_id = '1426279' THEN 1 ELSE null END) as feedback_was_dirty,
		MAX(CASE WHEN fd.feedback_reason_id = '1426280' THEN 1 ELSE null END) as feedback_fraud,
		MAX(CASE WHEN fd.feedback_reason_id = '1427266' THEN 1 ELSE null END) as feedback_dont_like_the_colour,
		MAX(CASE WHEN fd.feedback_reason_id = '1539154' THEN 1 ELSE null END) as feedback_dont_like_the_pattern,
		MAX(CASE WHEN fd.feedback_reason_id = '1539155' THEN 1 ELSE null END) as feedback_bad_fit
	FROM postgres.feedback fd
	WHERE fd.order_position_id is not null
	GROUP BY fd.order_position_id 
) feedback_case on feedback_case.order_position_id = op.id


