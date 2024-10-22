bucket=10208-fcd9acb029f419e6493edf97f4592b96
path=icebreaker-dev

help:
	@echo s3://${bucket}/${path}/

cdn:
	s3cmd put --recursive --acl-public --guess-mime-type campaigns s3://${bucket}/${path}/

rm:
	s3cmd rm --recursive s3://${bucket}/${path}/

sync:
	s3cmd sync s3://${bucket}/${path}/ cdn-local/

