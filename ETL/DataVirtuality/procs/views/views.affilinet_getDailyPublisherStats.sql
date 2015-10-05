-- Name: views.affilinet_getDailyPublisherStats
-- Created: 2015-04-24 18:19:18

create virtual procedure views.affilinet_getDailyPublisherStats ( 
in StartDate date,
in EndDate date,
in SubId string,
in ProgramTypes string,
in ValuationType string,
in ProgramId integer
)
returns (    
"Date" string,
"TotalCommission" string,
"TotalOpenCommission" string,
"PayPerClick_Commission" string,
"PayPerClick_Views" string,
"PayPerClick_Clicks" string,
"PayPerSaleLead_OpenCommission" string,
"PayPerSaleLead_OpenSales" string,
"PayPerSaleLead_CancelledSales" string,
"PayPerSaleLead_ConfirmedSales" string,
"PayPerSaleLead_Commission" string,
"PayPerSaleLead_Views" string,
"PayPerSaleLead_Clicks" string,
"CombinedPrograms_OpenCommission" string,
"CombinedPrograms_OpenSales" string,
"CombinedPrograms_CancelledSales" string,
"CombinedPrograms_ConfirmedSales" string,
"CombinedPrograms_Commission" string,
"CombinedPrograms_Views" string,
"CombinedPrograms_Clicks" string
)
as
begin
select r.*
 from table( exec affilinet.invoke( 
      EndPoint=>'https://api.affili.net/V2.0/PublisherStatistics.svc',
      action=>'http://affilinet.framework.webservices/Svc/PublisherStatisticsContract/GetDailyStatistics',     
       binding=>'SOAP11',
       request=>xmlparse
       (
          content '
          <svc:GetDailyStatisticsRequest xmlns:svc="http://affilinet.framework.webservices/Svc" xmlns:pub="http://affilinet.framework.webservices/types/PublisherStatistics">
          <svc:CredentialToken>' || ( call views.affilinet_getLogonToken( ) ) || '</svc:CredentialToken>
          <svc:GetDailyStatisticsRequestMessage>
            <pub:StartDate>' || FORMATDATE( StartDate,  'yyyy-MM-dd' ) || '</pub:StartDate>
            <pub:EndDate>' || FORMATDATE( EndDate,  'yyyy-MM-dd' ) || '</pub:EndDate>
            <pub:SubId>' || SubId ||'</pub:SubId>
            <pub:ProgramTypes>' || ProgramTypes || '</pub:ProgramTypes>
            <pub:ValuationType>' || ValuationType || '</pub:ValuationType>
            <pub:ProgramId>' || ProgramId || '</pub:ProgramId>
            </svc:GetDailyStatisticsRequestMessage>
        </svc:GetDailyStatisticsRequest>
        '
          )
       )
      ) c,
      xmltable( 
      xmlnamespaces( 'http://affilinet.framework.webservices/Svc' as "svc", 
      'http://affilinet.framework.webservices/types/PublisherStatistics' as "a",
      'http://www.w3.org/2001/XMLSchema-instance' as "i" ),
      '//a:DailyStatisticsRecord' PASSING c.result COLUMNS
        "Date" string PATH 'a:Date',
        "TotalCommission" string PATH 'a:TotalCommission',
        "TotalOpenCommission" string PATH 'a:TotalOpenCommission',
        "PayPerClick_Commission" string PATH 'a:PayPerClick/a:Commission',
        "PayPerClick_Views" string PATH 'a:PayPerClick/a:Views',
        "PayPerClick_Clicks" string PATH 'a:PayPerClick/a:Clicks',
        "PayPerSaleLead_OpenCommission" string PATH 'a:PayPerSaleLead/a:OpenCommission',
        "PayPerSaleLead_OpenSales" string PATH 'a:PayPerSaleLead/a:OpenSales',
        "PayPerSaleLead_CancelledSales" string PATH 'a:PayPerSaleLead/a:CancelledSales',
        "PayPerSaleLead_ConfirmedSales" string PATH 'a:PayPerSaleLead/a:ConfirmedSales',
        "PayPerSaleLead_Commission" string PATH 'a:PayPerSaleLead/a:Commission',
        "PayPerSaleLead_Views" string PATH 'a:PayPerSaleLead/a:Views',
        "PayPerSaleLead_Clicks" string PATH 'a:PayPerSaleLead/a:Clicks',
        "CombinedPrograms_OpenCommission" string PATH 'a:CombinedPrograms/a:OpenCommission',
        "CombinedPrograms_OpenSales" string PATH 'a:CombinedPrograms/a:OpenSales',
        "CombinedPrograms_CancelledSales" string PATH 'a:CombinedPrograms/a:CancelledSales',
        "CombinedPrograms_ConfirmedSales" string PATH 'a:CombinedPrograms/a:ConfirmedSales',
        "CombinedPrograms_Commission" string PATH 'a:CombinedPrograms/a:Commission',
        "CombinedPrograms_Views" string PATH 'a:CombinedPrograms/a:Views',
        "CombinedPrograms_Clicks" string PATH 'a:CombinedPrograms/a:Clicks'
     ) r;
end


