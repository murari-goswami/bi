-- Name: affilinet_adv.channels_channelgroup1
-- Created: 2015-04-24 18:19:33
-- Updated: 2015-04-24 18:19:33

create view affilinet_adv.channels_channelgroup1
as 
select * from ( call affilinet_adv.GetChannels( 'ChannelGroup1', 5245 ) ) a


