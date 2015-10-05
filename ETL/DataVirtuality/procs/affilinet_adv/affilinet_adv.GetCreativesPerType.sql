-- Name: affilinet_adv.GetCreativesPerType
-- Created: 2015-04-24 18:09:56

CREATE VIRTUAL PROCEDURE affilinet_adv.GetCreativesPerType
(
   IN CreativeType string, IN ProgramId integer
)
RETURNS (CreativeNumber integer, CreativeName string) AS BEGIN
SELECT
parseinteger(xml_table.CreativeNumber, '') AS CreativeNumber,
xml_table.CreativeName
FROM (EXEC affilinet_adv.Toolbox('GetCreativesPerType', ((((' <mes:CreativeType>' || CreativeType) || '</mes:CreativeType><mes:ProgramId>') || ProgramId) || '</mes:ProgramId>'))) AS f,
XMLTABLE
(
   XMLNAMESPACES('http://schemas.xmlsoap.org/soap/envelope/' AS s,
   'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd' AS u,
   'http://affilinet.framework.esbfa/advertiserservices/toolbox/types' AS a),
   '//a:CreativeCollection' PASSING f.response COLUMNS CreativeNumber STRING PATH 'a:CreativeNumber',
   CreativeName STRING PATH 'a:CreativeName'
)
AS xml_table;
END


