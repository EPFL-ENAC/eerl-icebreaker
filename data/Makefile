version=$(shell date +%FT%H:%M)
bucket=10208-fcd9acb029f419e6493edf97f4592b96
path=icebreaker-dev

help:
	@echo s3://${bucket}/${path}/${version}/

cdn:
	s3cmd put --recursive --acl-public --guess-mime-type campaigns s3://${bucket}/${path}/${version}/

