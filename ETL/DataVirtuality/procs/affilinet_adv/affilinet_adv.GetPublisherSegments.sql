-- Name: affilinet_adv.GetPublisherSegments
-- Created: 2015-04-24 18:09:56

CREATE VIRTUAL PROCEDURE affilinet_adv.GetPublisherSegments
(
   IN ProgramId integer
)
RETURNS (SegmentId integer, Description string, SegmentName string) AS BEGIN
SELECT
xml_table.SegmentId, xml_table.Description, xml_table.SegmentName
FROM (EXEC affilinet_adv.Toolbox('GetPublisherSegments', (('<mes:ProgramId>' || ProgramId) || '</mes:ProgramId>'))) AS f,
XMLTABLE
(
   XMLNAMESPACES('http://schemas.xmlsoap.org/soap/envelope/' AS s,
   'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd' AS u,
   'http://affilinet.framework.esbfa/advertiserservices/toolbox/types' AS a),
   '//a:PublisherSegmentCollection' PASSING f.response COLUMNS SegmentId integer PATH 'a:SegmentId',
   Description string PATH 'a:Description',
   SegmentName string PATH 'a:SegmentName'
)
AS xml_table;
END


