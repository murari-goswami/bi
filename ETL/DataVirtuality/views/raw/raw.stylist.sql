-- Name: raw.stylist
-- Created: 2015-04-24 18:18:07
-- Updated: 2015-07-23 09:53:19

CREATE VIEW raw.stylist
AS
SELECT
	p.id as stylist_id,
	sfu.sf_user_id as salesforce_customer_id,
	CASE 
		WHEN SUBSTRING(sfu.user_role, 0, CASE WHEN LOCATE(' ', sfu.user_role) > 0 THEN LOCATE(' ', sfu.user_role)-1 ELSE LENGTH(sfu.user_role) END) = TRIM(p.first_name) THEN 'Lead'
		WHEN p.id = 1282479 THEN 'Lead'  /* Mandy Brunnecker */
		WHEN TRIM(p.first_name) = 'OUTFITTERY' OR TRIM(p.last_name) = 'OUTFITTERY' OR p.id = 118566682 OR TRIM(p.first_name) = 'Stylingteam' THEN 'Fake'
		ELSE 'Stylist'
	END as role,
	sfu.Username as stylist_email,
	p.enabled,
	p.callable,
	p.balancer_enabled,
	CASE WHEN TRIM(p.first_name) = 'OUTFITTERY' OR TRIM(p.last_name) = 'OUTFITTERY' OR p.id = 118566682 OR TRIM(p.first_name) = 'Stylingteam' THEN false ELSE true END as real_stylist,
	TRIM(p.first_name) as first_name,
	TRIM(p.last_name) as last_name,
	TRIM(p.first_name) || ' ' || TRIM(p.last_name) as stylist_original,
	sfu.Name as stylist,
	sfu.user_role as team,
	sfu.profile_name,
	p.balance_strategy_resolver_string
FROM postgres.principal p
LEFT JOIN views.salesforce_user_info sfu on LEFT(p.salesforce_id,15) = LEFT(sfu.sf_user_id,15)  /* p.salesforce_id is truncated to 15 characters!?! */
WHERE p.class='com.ps.stylelist.Stylelist'
AND p.salesforce_id IS NOT NULL


