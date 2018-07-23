FROM ubuntu

RUN apt-get update -y

RUN apt-get install -y --no-install-recommends golang vim git ca-certificates

CMD /bin/bash /root/go/src/github.com/eelf/social-net/build/init.sh
