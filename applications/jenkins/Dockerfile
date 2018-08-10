FROM jenkins/jenkins:2.136
USER root
#Installing Docker
RUN apt-get update && apt-get install software-properties-common apt-transport-https ca-certificates -y; \
curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -;\
add-apt-repository  "deb [arch=amd64] https://download.docker.com/linux/debian  $(lsb_release -cs) stable";\
apt-get update && apt-get install docker-ce -y

#Installing kubernetes kubelet
RUN add-apt-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main";\
apt-get update && apt-get install kubectl kubelet -y --allow-unauthenticated

#Installing kubectl from Docker
#RUN curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -;\
#touch /etc/apt/sources.list.d/kubernetes.list;\
#echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list;\
#apt-get update && apt-get install -y kubectl

# Make sure jenkins user has docker.sock privileges 
RUN addgroup --gid 1001 dsock
RUN gpasswd -a jenkins dsock 
USER jenkins
