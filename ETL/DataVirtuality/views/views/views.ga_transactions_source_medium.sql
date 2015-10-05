-- Name: views.ga_transactions_source_medium
-- Created: 2015-04-24 18:17:10
-- Updated: 2015-04-24 18:17:10

CREATE view views.ga_transactions_source_medium as
SELECT
	source_medium as sourceMedium,
	channel as channel
FROM "dwh.ga_channel_translation"


