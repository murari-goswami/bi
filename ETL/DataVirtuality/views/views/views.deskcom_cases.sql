-- Name: views.deskcom_cases
-- Created: 2015-04-24 18:17:11
-- Updated: 2015-04-24 18:17:11

CREATE view views.deskcom_cases
as 
SELECT Deskcom__Account__c,Name,Deskcom__created_at__c 
FROM salesforce.Deskcom__Case__c


