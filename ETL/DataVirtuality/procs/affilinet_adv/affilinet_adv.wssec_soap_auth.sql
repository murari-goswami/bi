-- Name: affilinet_adv.wssec_soap_auth
-- Created: 2015-04-24 18:06:24

CREATE VIRTUAL PROCEDURE affilinet_adv.wssec_soap_auth() RETURNS (wssec_header string) AS
BEGIN
INSERT into #cre select * from ( call "affilinet_adv.internal_getCredentials"(
    "datasourceName" => 'affilinet_src',
    "username" => 'USERNAME',
    "password" => 'PASSWORD'
) )a;

DECLARE string username = select username from #cre; 
DECLARE string password = select password from #cre; 
SELECT (('<SOAP-ENV:Header>
    <ns2:Security SOAP-ENV:mustUnderstand="1">
      <ns2:UsernameToken>
        <ns2:Username>' || username ||'</ns2:Username>
        <ns2:Password>' || password ||'</ns2:Password>
        <ns3:Created>' || FORMATTIMESTAMP(now(), 'yyyy-MM-dd''T''HH:mm:ss''Z''')) || '</ns3:Created>
      </ns2:UsernameToken>
    </ns2:Security>
  </SOAP-ENV:Header>');
END


