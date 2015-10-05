-- Name: affilinet_adv.parseGetOrders
-- Created: 2015-04-24 18:07:13

CREATE VIRTUAL PROCEDURE affilinet_adv.parseGetOrders
(
   IN xmldata xml
)
RETURNS 
(
	"auto_order_management_action" string,
	"auto_order_management_action_date" timestamp,
	"cancellation_reason" string,
	"click_date" timestamp,
	"last_status_change_date" timestamp,
	"net_price" double,
	"network_fee" double,
	"order_id" string,
	"publisher_commission" double,
	"publisher_id" integer,
	"registration_date" timestamp,
	"transaction_id" integer,
	"transaction_status" string,
	"creative_info_creative_number" integer,
	"creative_info_creative_type" string,
	"rate_info_is_tiered_rate" boolean,
	"rate_info_rate_description" string,
	"rate_info_rate_mode" string,
	"rate_info_rate_number" integer,
	"rate_info_rate_value" double,
	"total_count" integer
)
AS BEGIN
SELECT 
"xml_table.auto_order_management_action" as "auto_order_management_action",
parsetimestamp( nullif( "xml_table.auto_order_management_action_date", '' ), 'yyyy-MM-dd''T''HH:mm:ss' ) as "auto_order_management_action_date",  
"xml_table.cancellation_reason" as "cancellation_reason",
parsetimestamp( nullif( "xml_table.click_date", '' ) , 'yyyy-MM-dd''T''HH:mm:ss' ) as "click_date",
parsetimestamp( nullif( "xml_table.last_status_change_date", '' ) , 'yyyy-MM-dd''T''HH:mm:ss' ) as "last_status_change_date",
cast( nullif( "xml_table.net_price" , '' ) as double )  as "net_price",
cast( nullif( "xml_table.network_fee", '' ) as double )  as "network_fee",
"xml_table.order_id" as "order_id",
cast( nullif( "xml_table.publisher_commission", '' ) as double ) as "publisher_commission",
cast( nullif( "xml_table.publisher_id", '' ) as integer ) as "publisher_id",
parsetimestamp( nullif( "xml_table.registration_date", '' ) , 'yyyy-MM-dd''T''HH:mm:ss' ) as "registration_date",
cast( nullif( "xml_table.transaction_id", '' ) as integer ) as "transaction_id",
"xml_table.transaction_status" as "transaction_status",
cast( nullif( "xml_table.creative_info_creative_number", '' ) as integer ) as "creative_info_creative_number",
"xml_table.creative_info_creative_type" as "creative_info_creative_type",
cast( nullif( "xml_table.rate_info_is_tiered_rate", '' ) as boolean )  as "rate_info_is_tiered_rate",
"xml_table.rate_info_rate_description" as "rate_info_rate_description",
"xml_table.rate_info_rate_mode" as "rate_info_rate_mode",
cast( nullif( "xml_table.rate_info_rate_number", '' ) as integer ) as "rate_info_rate_number",
cast( nullif( "xml_table.rate_info_rate_value", '' ) as double )as "rate_info_rate_value",
cast( nullif( "xml_table.total_count", '' ) as integer ) as "total_count"
FROM 
XMLTABLE(XMLNAMESPACES( DEFAULT 'http://affilinet.framework.esbfa/advertiserservices/ordermanagement/messages','http://affilinet.framework.esbfa/advertiserservices/ordermanagement/types' as "a",'http://www.w3.org/2001/XMLSchema-instance' as "i" ),
'//GetOrdersResponse/OrderCollection/a:Order' PASSING xmldata 
	COLUMNS 
	"auto_order_management_action" STRING  PATH 'a:AutoOrderManagementAction',
	"auto_order_management_action_date" STRING  PATH 'a:AutoOrderManagementActionDate',
	"cancellation_reason" STRING  PATH 'a:CancellationReason',
	"click_date" STRING  PATH 'a:ClickDate',
	"last_status_change_date" STRING  PATH 'a:LastStatusChangeDate',
	"net_price" STRING  PATH 'a:NetPrice',
	"network_fee" STRING  PATH 'a:NetworkFee',
	"order_id" STRING  PATH 'a:OrderId',
	"publisher_commission" STRING  PATH 'a:PublisherCommission',
	"publisher_id" STRING  PATH 'a:PublisherId',
	"registration_date" STRING  PATH 'a:RegistrationDate',
	"transaction_id" STRING  PATH 'a:TransactionId',
	"transaction_status" STRING  PATH 'a:TransactionStatus',
	"creative_info_creative_number" STRING  PATH 'a:CreativeInfo/a:CreativeNumber',
	"creative_info_creative_type" STRING  PATH 'a:CreativeInfo/a:CreativeType',
	"rate_info_is_tiered_rate" STRING  PATH 'a:RateInfo/a:IsTieredRate',
	"rate_info_rate_description" STRING  PATH 'a:RateInfo/a:RateDescription',
	"rate_info_rate_mode" STRING  PATH 'a:RateInfo/a:RateMode',
	"rate_info_rate_number" STRING  PATH 'a:RateInfo/a:RateNumber',
	"rate_info_rate_value" STRING  PATH 'a:RateInfo/a:RateValue',
	"total_count" STRING PATH '../../../GetOrdersResponse/TotalCount'
) "xml_table" ;
END


