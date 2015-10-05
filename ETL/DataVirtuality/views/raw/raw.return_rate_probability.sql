-- Name: raw.return_rate_probability
-- Created: 2015-07-22 18:37:40
-- Updated: 2015-09-25 11:32:03

CREATE VIEW raw.return_rate_probability
AS

SELECT
   order_position_id,
   min(cast(return_probability as double)) as return_probability
FROM "mlpg.order_position_return_rate_prediction"
group by 1


