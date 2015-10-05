-- Name: views.salesforce_user_info
-- Created: 2015-04-24 18:17:10
-- Updated: 2015-04-24 18:17:10

CREATE view views.salesforce_user_info 
as
SELECT 
	/*User Information*/
	sf_user.Id as sf_user_id,
	sf_user.Username,
	sf_user.LastName,
	sf_user.FirstName,
	sf_user.Name,
	sf_user.CompanyName,
	/*Salesforce Profile*/
	prof."Name" as profile_name,
	/*User role are based on team lead of stylist*/
	urole.id,
	urole."Name" as user_role
FROM "salesforce"."User_" sf_user 
inner join "salesforce"."UserRole" urole on urole.id=sf_user.UserRoleId
inner join "salesforce"."Profile" prof on prof.id=sf_user.ProfileId


