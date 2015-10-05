-- Name: affilinet_adv.GetOrders
-- Created: 2015-04-24 18:08:59

CREATE VIRTUAL PROCEDURE affilinet_adv.GetOrders(
IN program_id				integer,
IN start_date				date,
IN end_date				date,
IN valuation_type			string,
IN transaction_status		string,
IN basket_ids				string,
IN cancellation_reason		string,
IN channel1				integer,
IN channel2				integer,
IN creative_info			string,
IN net_price_max			double,
IN net_price_min			double,
IN order_id				string,
IN publisher_commission_max	double,
IN Publisher_commission_min	double,
IN publisher_ids			string,
IN publisher_segment		integer,
IN rate_mode				string,
IN rate_number				integer,
IN transaction_ids			string,
IN current_page			integer,
IN page_size				integer
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
	"rate_info_rate_value" double
) 
AS BEGIN
DECLARE string		missing_arguments = '';
DECLARE string 	request_xml_1    ='';
DECLARE string 	request_xml_2    ='';
DECLARE integer	total_rows	= 300;
DECLARE integer	i_current_page		= 1;
DECLARE integer	i_page_size		= 150;

IF( current_page IS NOT NULL  ) 
	BEGIN
		i_current_page = current_page;
	END 
IF( page_size IS NOT NULL  ) 
	BEGIN
		i_page_size = page_size;
	END 
IF( program_id IS NULL  ) 
	BEGIN
		missing_arguments = missing_arguments || 'program_id, ';
	END 
IF( valuation_type IS NULL  ) 
	BEGIN
		missing_arguments = missing_arguments || 'valuation_type, ';
	END 
IF( transaction_status IS NULL  ) 
	BEGIN
		missing_arguments = missing_arguments || 'transaction_status, ';
	END 	
IF( start_date IS NULL  ) 
	BEGIN
		missing_arguments = missing_arguments || 'start_date, ';
	END 
IF( end_date IS NULL  ) 
	BEGIN
		missing_arguments = missing_arguments || 'end_date, ';
	END 
IF( missing_arguments <> ''  ) 
	BEGIN
		ERROR 'Arguments ' || missing_arguments || ' must not be empty';
	END 

request_xml_1 = CASE WHEN basket_ids IS NOT NULL THEN '<mes:BasketIds>' || basket_ids || '</mes:BasketIds>' ELSE '' END
			|| CASE WHEN cancellation_reason IS NOT NULL THEN '<mes:CancellationReason>' || cancellation_reason || '</mes:CancellationReason>' ELSE '' END
			|| CASE WHEN channel1 IS NOT NULL THEN '<mes:Channel1>' || channel1 || '</mes:Channel1>' ELSE '' END
			|| CASE WHEN channel2 IS NOT NULL THEN '<mes:Channel2>' || channel2 || '</mes:Channel2>' ELSE '' END
			|| CASE WHEN creative_info IS NOT NULL THEN '<mes:CreativeInfo>' || creative_info || '</mes:CreativeInfo>' ELSE '' END
			|| '<mes:EndDate>' || end_date || '</mes:EndDate>' 
			|| CASE WHEN net_price_max IS NOT NULL THEN '<mes:NetPriceMax>' || net_price_max || '</mes:NetPriceMax>' ELSE '' END
			|| CASE WHEN net_price_min IS NOT NULL THEN '<mes:NetPriceMin>' || net_price_min || '</mes:NetPriceMin>' ELSE '' END
			|| CASE WHEN order_id IS NOT NULL THEN '<mes:OrderId>' || order_id || '</mes:OrderId>' ELSE '' END
			|| '<mes:Page>';
request_xml_2 =  '</mes:Page>'
			|| '<mes:PageSize>' || i_page_size || '</mes:PageSize>'
			|| '<mes:ProgramId>' || program_id || '</mes:ProgramId>'
			|| CASE WHEN publisher_commission_max IS NOT NULL THEN '<mes:PublisherCommissionMax>' || publisher_commission_max || '</mes:PublisherCommissionMax>' ELSE '' END
			|| CASE WHEN Publisher_commission_min IS NOT NULL THEN '<mes:PublisherCommissionMin>' || Publisher_commission_min || '</mes:PublisherCommissionMin>' ELSE '' END
			|| CASE WHEN publisher_ids IS NOT NULL THEN '<mes:PublisherIds>' || publisher_ids || '</mes:PublisherIds>' ELSE '' END
			|| CASE WHEN publisher_segment IS NOT NULL THEN '<mes:PublisherSegment>' || publisher_segment|| '</mes:PublisherSegment>' ELSE '' END
			|| CASE WHEN rate_mode IS NOT NULL THEN '<mes:RateMode>' || rate_mode || '</mes:RateMode>' ELSE '' END
			|| CASE WHEN rate_number IS NOT NULL THEN '<mes:RateNumber>' || rate_number || '</mes:RateNumber>' ELSE '' END
			|| '<mes:StartDate>' || start_date || '</mes:StartDate>'
			|| CASE WHEN transaction_ids IS NOT NULL THEN '<mes:TransactionIds>' || transaction_ids || '</mes:TransactionIds>' ELSE '' END
			|| '<mes:TransactionStatus>' || transaction_status || '</mes:TransactionStatus>
			   <mes:ValuationType>' || valuation_type || '</mes:ValuationType>';
			   
SELECT * INTO #data 
  FROM (
	   call affilinet_adv.parseGetOrders
	   (
	      (
	       CALL affilinet_adv.OrderManagement( 'GetOrders', request_xml_1 || i_current_page || request_xml_2 )
	      ) 
	   )
) response;
i_current_page = 2;
total_rows=(SELECT "total_count" from #data LIMIT 1 );	
WHILE ( i_current_page < ( total_rows / i_page_size ) + 2 )
	BEGIN
		INSERT INTO #data SELECT * 
		 FROM (
			   call affilinet_adv.parseGetOrders
			   (
			      (
			       CALL affilinet_adv.OrderManagement( 'GetOrders', request_xml_1 || i_current_page || request_xml_2 )
			      ) 
			   )
		) response;
		i_current_page = i_current_page + 1;
	END
select * from #data;
END


