-- Name: tableau.stylist_overview_dashboard_customers
-- Created: 2015-04-24 18:19:38
-- Updated: 2015-05-12 11:25:18

CREATE VIEW tableau.stylist_overview_dashboard_customers
AS
SELECT
c.customer_id,
c.first_name || ' ' || c.last_name as customer_name,
c.stylist_id,
CASE 
  WHEN s.role = 'Fake' AND s.stylist_id != 118566682 THEN 'Fake Stylist ' || s.team
  ELSE s.first_name || ' ' || s.last_name 
END as stylist_name,
s.team as stylist_team,
s.role as stylist_role,
c.club_member,
c.club_membership_type,
c.preferred_contact_channel,
c.age_group,
c.customer_status,
c.gender
FROM bi.customer c
JOIN bi.stylist s on s.stylist_id = c.stylist_id
WHERE c.user_type = 'Real User'
AND s.enabled


