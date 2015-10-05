-- Name: views.stylist
-- Created: 2015-04-24 18:19:35
-- Updated: 2015-04-24 18:19:35

CREATE VIEW "views.stylist" 
AS
SELECT 
    salesforce_customer_id as salesforce_id,
    stylist_id,
    first_name,
    last_name,
    balance_strategy_resolver_string,
    stylist as Name,
    stylist_original, /*this stylist name is based order level*/
    "enabled",
    real_stylist,
    profile_name,   
    '0' as Id,
    team as user_role
FROM "bi.stylist"


