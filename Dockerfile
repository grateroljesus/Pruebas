FROM image-registry.openshift-image-registry.svc:5000/demo2/echo
RUN 	chgrp -R 0 /var/lib/rpm/ &&\
		chmod -R g=u /var/lib/rpm/
RUN yum install -y telnet 
	