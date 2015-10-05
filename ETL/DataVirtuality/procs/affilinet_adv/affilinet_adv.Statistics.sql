-- Name: affilinet_adv.Statistics
-- Created: 2015-04-24 18:08:29

CREATE VIRTUAL PROCEDURE affilinet_adv.Statistics(IN do_action string, IN request_xml string) RETURNS (response xml) AS
BEGIN
SELECT * FROM TABLE(EXEC affilinet_src.invoke(binding => 'SOAP11', action => ('http://affilinet.framework.esbfa/advertiserservices/statistics/AdvertiserStatisticsContract/' || do_action), request => XMLPARSE(CONTENT (((((((('<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mes="http://affilinet.framework.esbfa/advertiserservices/statistics/messages"  xmlns:typ="http://affilinet.framework.esbfa/advertiserservices/statistics/types" xmlns:ns2="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:ns3="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' || (SELECT * FROM (EXEC affilinet_adv.wssec_soap_auth()) AS x)) || '<SOAP-ENV:Body>
	    <mes:') || do_action) || 'Request>
	     ') || request_xml) || '
	    </mes:') || do_action) || 'Request>
	  </SOAP-ENV:Body>
	</SOAP-ENV:Envelope>')), endpoint => 'https://advertiser-webservices.affili.net/V4/advertiserservice.svc')) AS c;
END


