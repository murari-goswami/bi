-- Name: affilinet_adv.OrdersLastMonthByRegistrationDate
-- Created: 2015-04-24 18:19:33
-- Updated: 2015-04-24 18:19:33

create view affilinet_adv.OrdersLastMonthByRegistrationDate as
select * from (call "affilinet_adv.GetOrders"(
    "program_id" => 5245,
    "start_date" => TIMESTAMPADD( SQL_TSI_MONTH, -1, curdate() ),
    "end_date" => curdate(),
    "valuation_type" => 'RegistrationDate',
    "transaction_status" =>'All'
)) a


