FROM netcat:latest
USER 1001
CMD bash -c "nc 172.30.68.1 446"
	