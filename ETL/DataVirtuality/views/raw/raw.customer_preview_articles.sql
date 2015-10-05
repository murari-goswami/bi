-- Name: raw.customer_preview_articles
-- Created: 2015-04-24 18:17:44
-- Updated: 2015-04-24 18:17:44

CREATE VIEW raw.customer_preview_articles
AS
SELECT
	p.id as customer_preview_id,
	p.preview_id,
	p.customer_id,
	p.order_id,
	p.created_by_id as created_by_id,
	pp.id as customer_preview_position_id,
	pp.article_id,
	a.model_id as article_model_id,
	pp.group_id as outfit_id,
	p.date_created as date_created,
	pp.preview_positions_idx as article_count,
	CASE 
		WHEN p.state = 8 THEN 'Sent to Customer'
		WHEN p.state = 16 THEN 'Feedback from Customer'
		ELSE 'Unknown'
	END	as state,
	CASE 
		WHEN pp.variant = 1 THEN 'Positive'
		WHEN pp.variant = 0 THEN 'Neutral'
		WHEN pp.variant = -1 THEN 'Negative'
		ELSE 'Unknown'
	END as main_feedback,
	feedback.feedback_dont_like_the_brand,
	feedback.feedback_too_expensive,
	feedback.feedback_not_needed,
	feedback.feedback_too_simple,
	feedback.feedback_too_outrageous,
	feedback.feedback_dont_like_style,
	feedback.feedback_dont_like_the_colour,
	feedback.feedback_dont_like_the_pattern
FROM postgres.preview p 
JOIN postgres.preview_position pp on pp.preview_id = p.id
JOIN postgres.article a on a.id = pp.article_id
LEFT JOIN (
	SELECT
		fd.preview_position_id,
		/* NOTE: Feedback reasons are ordered by feedback_reason_id here to make it easier to compare to postgres.feedback_reason */
		sum(case when fd.feedback_reason_id = '380476' then 1 else null end)  as feedback_dont_like_the_brand,
		sum(case when fd.feedback_reason_id = '380479' then 1 else null end)  as feedback_too_expensive,
		sum(case when fd.feedback_reason_id = '380482' then 1 else null end)  as feedback_not_needed,
		sum(case when fd.feedback_reason_id = '539682' then 1 else null end)  as feedback_too_simple,
		sum(case when fd.feedback_reason_id = '1296049' then 1 else null end) as feedback_too_outrageous,
		sum(case when fd.feedback_reason_id = '1361878' then 1 else null end) as feedback_dont_like_style,
		sum(case when fd.feedback_reason_id = '1427266' then 1 else null end) as feedback_dont_like_the_colour,
		sum(case when fd.feedback_reason_id = '1539154' then 1 else null end) as feedback_dont_like_the_pattern
	FROM postgres.feedback fd
	WHERE fd.preview_position_id is not null
	GROUP BY fd.preview_position_id 
) feedback on feedback.preview_position_id = pp.id
WHERE p.class = 'com.ps.customer.preview.CustomerPreview'


