-- Name: views.affilinet_getLogonToken
-- Created: 2015-04-24 18:17:53

CREATE VIRTUAL PROCEDURE views.affilinet_getLogonToken(IN Username string, IN Password string, IN WebServiceType string) RETURNS (credentialToken string) AS
BEGIN
SELECT r.* FROM TABLE(EXEC affilinet.invoke(EndPoint => 'https://api.affili.net/V2.0/Logon.svc', action => 'http://affilinet.framework.webservices/Svc/ServiceContract1/Logon', binding => 'SOAP11', request => XMLPARSE(CONTENT (((((('
          <svc:LogonRequestMsg xmlns:svc="http://affilinet.framework.webservices/Svc" xmlns:typ="http://affilinet.framework.webservices/types">
           <typ:Username>' || 'anja.schreiber@outfittery.de') || '</typ:Username>
           <typ:Password>') || 'paulsaffilies') || '</typ:Password>
           <typ:WebServiceType>') || 'Publisher') || '</typ:WebServiceType>
           <typ:DeveloperSettings>
              <typ:SandboxPublisherID>403233</typ:SandboxPublisherID>
           </typ:DeveloperSettings>
       </svc:LogonRequestMsg>')))) AS c, XMLTABLE('//*' PASSING c.result COLUMNS CredentialToken string PATH '.') AS r;
END


