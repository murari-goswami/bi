-- Name: views.salesforce_task
-- Created: 2015-04-24 18:17:17
-- Updated: 2015-04-24 18:17:17

CREATE view views.salesforce_task 
as
SELECT 
Id,
AccountId,
Subject,
WhatId as opportunity_id,
CreatedDate
FROM salesforce.Task 
where subject = 'Email: Feedback mit Mail' or subject = 'Freunde empfehlen - DU'


