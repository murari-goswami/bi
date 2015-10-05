-- Name: affilinet_adv.GetRateList
-- Created: 2015-04-24 18:09:56

CREATE VIRTUAL PROCEDURE affilinet_adv.GetRateList
(
   IN ProgramId integer
)
RETURNS (RateNumber integer, RateMode string, RateName string) AS BEGIN
SELECT
xml_table.RateNumber, xml_table.RateMode, xml_table.RateName
FROM (EXEC affilinet_adv.Toolbox('GetRateList', (('<mes:ProgramId>' || ProgramId) || '</mes:ProgramId>'))) AS f,
XMLTABLE
(
   XMLNAMESPACES('http://schemas.xmlsoap.org/soap/envelope/' AS s, 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd' AS u,
   'http://affilinet.framework.esbfa/advertiserservices/toolbox/types' AS a),
   '//a:RateCollection' PASSING f.response COLUMNS RateNumber integer PATH 'a:RateNumber',
   RateMode string PATH 'a:RateMode',
   RateName string PATH 'a:RateName'
)
AS xml_table;
END


