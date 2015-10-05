-- Name: ga.goal_conversion
-- Created: 2015-04-24 18:17:43
-- Updated: 2015-04-24 18:17:43

CREATE view ga.goal_conversion
AS 
SELECT  
 g1.date_created,
 g1.country,
 g1.medium,
 g1.source,
 g1.devicecategory,
 g1.goal_1 as "lead_conversion", 
 g1.goal_2 as "re_preview_favourite", 
 g1.goal_3 as "order_conversion", 
 g1.goal_4 as "phone_order_sucesses", 
 g1.goal_5 as "re_survey", 
 g1.goal_6 as "re_accountcreation1", 
 g1.goal_7 as "re_accountcreation2", 
 g1.goal_8 as "backend_overview", 
 g1.goal_9 as "backend_payment", 
 g1.goal_10 as "re_successnc_date", 
 g2.goal_11 as "re_successscreenfitprnocdacoh", 
 g2.goal_12 as "showroom_open", 
 g2.goal_13 as "re_sizes", 
 g2.goal_14 as "re_ordercreation", 
 g2.goal_15 as "re_pickcalldate", 
 g2.goal_16 as "re_successscreen_all", 
 g2.goal_17 as "re_profilecreation", 
 g2.goal_18 as "createprofile", 
 g2.goal_19 as "re_successnc", 
 g2.goal_20 as "re_successec" 
FROM "dwh.ga_goals_1" g1
LEFT JOIN "dwh.ga_goals_2" g2 on g1.date_created=g2.date_created and g1.country=g2.country and g1.medium=g2.medium and g1.source=g2.source and g1.devicecategory=g2.devicecategory


