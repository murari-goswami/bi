-- Name: raw.stylist_action_tracking
-- Created: 2015-04-24 18:17:44
-- Updated: 2015-04-24 18:17:44

CREATE VIEW raw.stylist_action_tracking AS

/* THIS QUERY CAPTURES STYLIST ACTIONS IN ADMIDALA AND TIMES ASSOCIATED WITH THEM */

SELECT
	at.stylist_id,
	st.stylist_name,
	at.order_id,
	MIN(at2.first_pick) as first_pick,
	MAX(at2.last_pick) as last_pick,
	TIMESTAMPDIFF(SQL_TSI_MINUTE, MIN(at2.first_pick), MAX(at2.last_pick)) AS stylist_pick_minutes,
	COUNT(case when at.action = 'ARTICLE_ADD' then 1 end) AS stylist_article_adds,
	COUNT(case when at.action = 'SEARCH' then 1 end) as stylist_article_searches,
	COUNT(case when at.action = 'ARTICLE_REMOVE' then 1 end) as stylist_article_removals,
	MIN(CASE WHEN action = 'PHONE_INTERFACE_START' THEN date_created END) as date_phone_call_started,
	MAX(CASE WHEN action = 'PHONE_INTERFACE_STOP' THEN date_created END) as date_phone_call_ended
FROM postgres.action_tracking at
JOIN
	(SELECT
		at.order_id,
		at.stylist_id,
		MIN(case when at.action = 'ARTICLE_ADD' then at.date_created else null end) AS first_pick, 
		MAX(case when at.action = 'ARTICLE_ADD' then at.date_created else null end) AS last_pick
		FROM postgres.action_tracking at
		group by 1,2
	) at2 on at.order_id = at2.order_id and at.stylist_id = at2.stylist_id
LEFT JOIN
	(SELECT      
		p.id AS stylist_id,
          p.first_name  || ' ' || p.last_name AS stylist_name
          FROM postgres.principal p
          WHERE p.class='com.ps.stylelist.Stylelist'
     ) st on st.stylist_id = at.stylist_id 
where at.date_created < at2.last_pick
group by 1,2,3


