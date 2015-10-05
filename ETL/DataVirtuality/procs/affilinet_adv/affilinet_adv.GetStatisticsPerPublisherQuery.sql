-- Name: affilinet_adv.GetStatisticsPerPublisherQuery
-- Created: 2015-04-24 18:09:09

CREATE VIRTUAL PROCEDURE affilinet_adv.GetStatisticsPerPublisherQuery(
IN program_id			integer,
IN start_date			date,
IN end_date			date,
IN channel1			integer,
IN channel2			integer,
IN creative_number		integer,
IN creative_type		string,
IN PublisherId			integer,
IN PublisherName		string,
IN PublisherSegment		integer,
IN PublisherURL		string,
IN RateQueryCollection	string,
IN ValuationType		string,
IN VolumeMax			integer,
IN VolumeMin			integer,
IN VolumeType			string,
IN VolumeTypeRateNumber	integer,
IN show_details		boolean,
IN current_page		integer,
IN page_size			integer
)
RETURNS
(
 currency string,
 publisher_id string,
 publisher_url string,
 bonus_count_cancelled_count long,
 bonus_count_confirmed_count long,
 bonus_count_open_count long,
 bonus_network_fee_cancelled_value double,
 bonus_network_fee_confirmed_value double,
 bonus_network_fee_open_value double,
 bonus_publisher_commission_cancelled_value double,
 bonus_publisher_commission_confirmed_value double,
 bonus_publisher_commission_open_value double,
 click_outs_total_count_cancelled_count long,
 click_outs_total_count_confirmed_count long,
 click_outs_total_count_open_count long,
 click_outs_total_net_price_cancelled_value double,
 click_outs_total_net_price_confirmed_value double,
 click_outs_total_net_price_open_value double,
 click_outs_total_network_fee_cancelled_value double,
 click_outs_total_network_fee_confirmed_value double,
 click_outs_total_network_fee_open_value double,
 click_outs_total_publisher_commission_cancelled_value double,
 click_outs_total_publisher_commission_confirmed_value double,
 click_outs_total_publisher_commission_open_value double,
 clicks_gross_count long,
 clicks_net_count long,
 clicks_network_fee double,
 clicks_publisher_commission double,
 leads_total_count_cancelled_count long,
 leads_total_count_confirmed_count long,
 leads_total_count_open_count long,
 leads_total_net_price_cancelled_value double,
 leads_total_net_price_confirmed_value double,
 leads_total_net_price_open_value double,
 leads_total_network_fee_cancelled_value double,
 leads_total_network_fee_confirmed_value double,
 leads_total_network_fee_open_value double,
 leads_total_publisher_commission_cancelled_value double,
 leads_total_publisher_commission_confirmed_value double,
 leads_total_publisher_commission_open_value double,
 net_price_summary_cancelled_value double,
 net_price_summary_confirmed_value double,
 net_price_summary_open_value double,
 network_fee_summary_cancelled_value double,
 network_fee_summary_confirmed_value double,
 network_fee_summary_open_value double,
 publisher_commission_summary_cancelled_value double,
 publisher_commission_summary_confirmed_value double,
 publisher_commission_summary_open_value double,
 sales_total_count_cancelled_count long,
 sales_total_count_confirmed_count long,
 sales_total_count_open_count long,
 sales_total_net_price_cancelled_value string,
 sales_total_net_price_confirmed_value double,
 sales_total_net_price_open_value double,
 sales_total_network_fee_cancelled_value double,
 sales_total_network_fee_confirmed_value double,
 sales_total_network_fee_open_value double,
 sales_total_publisher_commission_cancelled_value double,
 sales_total_publisher_commission_confirmed_value double,
 sales_total_publisher_commission_open_value double,
 Views_GrossCount long,
 Views_NetCount long,
 Views_NetworkFee double,
 Views_PublisherCommission double
) 
AS BEGIN
DECLARE string		missing_arguments = '';
DECLARE string 	request_xml_1    ='';
DECLARE string 	request_xml_2    ='';
DECLARE integer	total_rows	= 300;
DECLARE integer	i_current_page		= 1;
DECLARE integer	i_page_size		= 150;
DECLARE boolean	i_show_details		= false;
IF( current_page IS NOT NULL  ) 
	BEGIN
		i_current_page = current_page;
	END 
IF( page_size IS NOT NULL  ) 
	BEGIN
		i_page_size = page_size;
	END 
IF( show_details IS NOT NULL  ) 
	BEGIN
		i_show_details = show_details;
	END 
IF( program_id IS NULL  ) 
	BEGIN
		missing_arguments = missing_arguments || 'program_id, ';
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
request_xml_1 = '<mes:DisplaySettings>
			<typ:CurrentPage>';
request_xml_2 = '</typ:CurrentPage>
			<typ:PageSize>' || i_page_size || '</typ:PageSize>
		</mes:DisplaySettings>
		<mes:GetStatisticsPerPublisherQuery>
			<typ:EndDate>' || end_date || '</typ:EndDate>
			<typ:ProgramId>' || program_id || '</typ:ProgramId>
			<typ:ShowDetails>' || i_show_details || '</typ:ShowDetails>
			<typ:StartDate>' || start_date || '</typ:StartDate>'
			|| CASE WHEN channel1 IS NOT NULL THEN '<typ:Channel1>' || channel1 || '</typ:Channel1>' ELSE '' END
			|| CASE WHEN channel2 IS NOT NULL THEN '<typ:Channel2>' || channel2 || '</typ:Channel2>' ELSE '' END
			|| CASE WHEN creative_number IS NOT NULL THEN '<typ:CreativeNumber>' || creative_number || '</typ:CreativeNumber>' ELSE '' END
			|| CASE WHEN creative_type IS NOT NULL THEN '<typ:CreativeType>' || creative_type || '</typ:CreativeType>' ELSE '' END
			|| CASE WHEN PublisherId IS NOT NULL THEN '<typ:PublisherId>' || PublisherId || '</typ:PublisherId>' ELSE '' END
			|| CASE WHEN PublisherName IS NOT NULL THEN '<typ:PublisherName>' || PublisherName || '</typ:PublisherName>' ELSE '' END
			|| CASE WHEN PublisherSegment IS NOT NULL THEN '<typ:PublisherSegment>' || PublisherSegment || '</typ:PublisherSegment>' ELSE '' END
			|| CASE WHEN PublisherURL IS NOT NULL THEN '<typ:PublisherURL>' || PublisherURL || '</typ:PublisherURL>' ELSE '' END
			|| CASE WHEN RateQueryCollection IS NOT NULL THEN '<typ:RateQueryCollection>' || RateQueryCollection || '</typ:RateQueryCollection>' ELSE '' END
			|| CASE WHEN ValuationType IS NOT NULL THEN '<typ:ValuationType>' || ValuationType || '</typ:ValuationType>' ELSE '' END
			|| CASE WHEN VolumeMax IS NOT NULL THEN '<VolumeMax>' || VolumeMax || '</VolumeMax>' ELSE '' END
			|| CASE WHEN VolumeMin IS NOT NULL THEN '<typ:VolumeMin>' || VolumeMin || '</typ:VolumeMin>' ELSE '' END
			|| CASE WHEN VolumeType IS NOT NULL THEN '<typ:VolumeType>' || VolumeType || '</typ:VolumeType>' ELSE '' END
			|| CASE WHEN VolumeTypeRateNumber IS NOT NULL THEN '<typ:VolumeTypeRateNumber>' || VolumeTypeRateNumber || '</typ:VolumeTypeRateNumber>' ELSE '' END
		|| '</mes:GetStatisticsPerPublisherQuery>';
SELECT * INTO #data 
  FROM (
	   call affilinet_adv.parseGetStatisticsPerPublisher
	   (
	      (
	       CALL affilinet_adv.Statistics( 'GetStatisticsPerPublisher', request_xml_1 || i_current_page || request_xml_2 )
	      ) 
	   )
) response;
i_current_page = 2;
total_rows=(SELECT "TotalCount" from #data LIMIT 1 );	
WHILE ( i_current_page < ( total_rows / i_page_size ) + 2 )
	BEGIN
		INSERT INTO #data SELECT * 
		 FROM (
			   call affilinet_adv.parseGetStatisticsPerPublisher
			   (
			      (
			       CALL affilinet_adv.Statistics( 'GetStatisticsPerPublisher', request_xml_1 || i_current_page || request_xml_2 )
			      ) 
			   )
		) response;
		i_current_page = i_current_page + 1;
	END
select * from #data;
END


