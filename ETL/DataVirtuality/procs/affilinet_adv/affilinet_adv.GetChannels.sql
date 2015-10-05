-- Name: affilinet_adv.GetChannels
-- Created: 2015-04-24 18:08:44

CREATE VIRTUAL PROCEDURE affilinet_adv.GetChannels
(
   IN ChannelGroup string, IN ProgramId integer
)
RETURNS
(
   ChannelId integer, ChannelName string, ChannelGroupName string
)
AS BEGIN
SELECT
parseinteger(xml_table.ChannelId, '') AS ChannelId,
xml_table.ChannelName,
xml_table.ChannelGroupName
FROM (EXEC affilinet_adv.Toolbox('GetChannels', ((((' <mes:ChannelGroup>' || ChannelGroup) || '</mes:ChannelGroup><mes:ProgramId>') || ProgramId) || '</mes:ProgramId>'))) AS f,
XMLTABLE
(
   XMLNAMESPACES( 
   'http://schemas.xmlsoap.org/soap/envelope/' AS s,
   'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd' AS u,
   'http://affilinet.framework.esbfa/advertiserservices/toolbox/types' AS a,
   'http://affilinet.framework.esbfa/advertiserservices/toolbox/messages' AS m),
   '//a:ChannelCollection' PASSING f.response COLUMNS a xml PATH '.',
   ChannelId STRING PATH 'a:ChannelId',
   ChannelName STRING PATH 'a:ChannelName',
   ChannelGroupName STRING PATH '../../m:ChannelGroupName'
)
AS xml_table;
END


