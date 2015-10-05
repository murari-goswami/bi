-- Name: raw.salesforce_ops_check
-- Created: 2015-07-31 09:41:43
-- Updated: 2015-07-31 09:41:43

/*This view is used for defining date_incoming in bi.customer_order
This job runs every 6 hours with full refresh*/
CREATE VIEW raw.salesforce_ops_check
AS

SELECT
	ExternalOrderId__c as order_id,
	StageName as salesforce_order_stage,
	OpsCheck__c as ops_check,
	SystemModstamp as last_updated_date
FROM "salesforce.Opportunity"


