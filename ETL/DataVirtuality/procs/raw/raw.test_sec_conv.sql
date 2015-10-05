-- Name: raw.test_sec_conv
-- Created: 2015-09-08 12:12:37

CREATE virtual procedure raw.test_sec_conv() as
begin
	DECLARE string p =  (call  "raw.sec_2_hrmisec"(9945));	
	insert into test_sec_tab (p_t) values (p);
end


