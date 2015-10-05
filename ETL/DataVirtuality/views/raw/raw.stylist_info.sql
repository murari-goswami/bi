-- Name: raw.stylist_info
-- Created: 2015-06-18 17:54:07
-- Updated: 2015-08-13 09:23:21

CREATE VIEW raw.stylist_info
AS

SELECT
  p.id as stylist_id,
  p.enabled,
  p.callable,
  p.balancer_enabled,
  CASE WHEN TRIM(p.first_name) = 'OUTFITTERY' OR TRIM(p.last_name) = 'OUTFITTERY' OR p.id = 118566682 OR TRIM(p.first_name) = 'Stylingteam' THEN false ELSE true END as real_stylist,
  TRIM(p.first_name) as first_name,
  TRIM(p.last_name) as last_name,
  TRIM(p.first_name) || ' ' || TRIM(p.last_name) as stylist_original,
  a.stylist,
  a.team_lead,
  CASE 
    WHEN TRIM(p.first_name) = 'OUTFITTERY' OR TRIM(p.last_name) = 'OUTFITTERY' OR p.id = 118566682 OR TRIM(p.first_name) = 'Stylingteam' THEN 'Fake'
    ELSE a.role
  END as role,
  p.balance_strategy_resolver_string
FROM postgres.principal p
/*This information is from ldap connector which connects to task manager*/
LEFT JOIN
(
  SELECT
  a.*,
  CASE 
    WHEN b.lead_name IS NOT NULL THEN 'Lead'
    ELSE 'Stylist'
  END AS role
FROM
(
  SELECT 
    col1 AS stylist,
  SUBSTRING(col2,4,LOCATE(',',col2)-4)team_lead,
  col3 as email
  FROM 
  (
    exec "ldap.native"
    (  
      "request" => 'search;context-name=cn=Users,dc=outfittery,dc=lan;filter=(objectClass=*);timeout=6;search-scope=ONELEVEL_SCOPE;attributes=cn,manager,mail,memberOf' 
    )
  ) AS r, 
  ARRAYTABLE(r.tuple COLUMNS col1 string, col2 string,col3 string,col4 string) x
)a 
LEFT JOIN
(
  SELECT
        SUBSTRING(col2,4,LOCATE(',',col2)-4) as lead_name
  FROM 
  (
    exec "ldap.native"
    (  
      "request" => 'search;context-name=cn=Groups,dc=outfittery,dc=lan;filter=(objectClass=*);timeout=6;search-scope=ONELEVEL_SCOPE;attributes=cn,member' 
    )
  ) AS r, 
  ARRAYTABLE(r.tuple COLUMNS col1 string, col2 string) x
  WHERE col1 LIKE '%stylist team%'
)b ON a.stylist=b.lead_name
)a on a.email=p.email
WHERE p.class='com.ps.stylelist.Stylelist'
AND p.salesforce_id IS NOT NULL


