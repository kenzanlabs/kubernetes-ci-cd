# Kubernetes ci/cd whitepaper for Linux.com

 This readme is dynamically generated when `node readme.js`

## Interactive tutorial version
* clone this repo

* Ensure you are starting with a clean slate: `minikube delete; minikube rm -rf ~/.minikube; rm -rf ~/.kube`

* run `npm install`

Begin the desired section `npm run part1` `npm run part2` `npm run part3`

## Manual tutorial version

## Part 1


### Part 1



### Step1

Start up the cluster with minikibe

`minikube start --memory 8000 --cpus 2 --kubernetes-version v1.6.0`

### Step2

Enable addons

`minikube addons enable heapster; minikube addons enable ingress`

### Step3

Wait 20 seconds and view minikube dashboard

`sleep 20; minikube service kubernetes-dashboard --namespace kube-system`

### Step4

Deploy the public nginx image from DockerHub

`kubectl run nginx --image nginx --port 80`

### Step5

Create a service for deployment

`kubectl expose deployment nginx --type NodePort --port 80`

### Step6

Launch browser to test service

`minikube service nginx`

### Step7

Install registry

`kubectl apply -f manifests/registry.yml`

### Step8

Wait for registry to deploy

`kubectl rollout status deployments/registry`

### Step9

View registry UI

`minikube service registry-ui`

### Step10

Edit the contents of applications/hello-kenzan/index.html. This will open the file with the nano editor. When finished press ctrl + x to exit and confirm save.

`nano applications/hello-kenzan/index.html`

### Step11

We will now build the image with a special name that is pointing at our cluster registry.

`docker build -t 127.0.0.1:30400/hello-kenzan:latest -f applications/hello-kenzan/Dockerfile applications/hello-kenzan`

### Step12

Before we can push our image we need to set up a temporary proxy. This is a container that listens on 127.0.0.1:30400 and forwads to our cluster. By default the docker client can only push to non https via localhost.

`docker stop socat-registry; docker rm socat-registry; docker run -d -e "REGIP=`minikube ip`" --name socat-registry -p 30400:5000 chadmoon/socat:latest bash -c "socat TCP4-LISTEN:5000,fork,reuseaddr TCP4:`minikube ip`:30400"`

### Step13

We can now push our image.

`docker push 127.0.0.1:30400/hello-kenzan:latest`

### Step14

Stop the registry proxy.

`docker stop socat-registry;`

### Step15

Now that our image is on the cluster we can deploy the manifests

`kubectl apply -f applications/hello-kenzan/k8s/deployment.yaml`

### Step16

View the app

`minikube service hello-kenzan`## Part 2


### Part 2



### Step1

Install Jenkins

`kubectl apply -f manifests/jenkins.yml; kubectl rollout status deployment/jenkins`

### Step2

Open the Jenkins service running in our cluster.  You will retrieve the admin password in the next step.

`minikube service jenkins`

### Step3

Get Jenkins admin password. Enter the admin password from above and choose "suggested plugins". Create a new job with type pipeline. Scroll down and under "pipeline script" choose "Pipeline script from SCM". Under SCM choose GIT. Fork repo and put "repository url" as your fork, such as https://github.com/kenzanlabs/kubernetes-ci-cd.git. Save and run the job.

`kubectl exec -it `kubectl get pods --selector=app=jenkins --output=jsonpath={.items..metadata.name}` cat /root/.jenkins/secrets/initialAdminPassword`

### Step4

View updated application

`minikube service hello-kenzan`

### Step5

Push a change to your fork. Run job again. View changes

`minikube service hello-kenzan`## Part 3


### Part 3



### Step1

Bootstrap etcd operator on the cluster

`scripts/etcd.sh`

### Step2

Run job to create etcd directory

`kubectl create -f manifests/etcd-job.yml`

### Step3

Check job status

`kubectl describe jobs/etcd-job`

### Step4

The crossword application is a multi-tier application and its services depend on each other.  For our first step we will create the 3 services ahead of time so that the deployments are already aware of them later.

`kubectl apply -f manifests/all-services.yml`

### Step5

Now we're going to walk through an initial build of the monitoring and scaling service for our crosswords application.

`docker build -t 127.0.0.1:30400/monitor-scale:`git rev-parse --short HEAD` -f applications/monitor/Dockerfile applications/monitor`

### Step6

Setup the proxy in order to push the monitoring docker image to our cluster's registry

`docker stop socat-registry; docker rm socat-registry; docker run -d -e "REGIP=`minikube ip`" --name socat-registry -p 30400:5000 chadmoon/socat:latest bash -c "socat TCP4-LISTEN:5000,fork,reuseaddr TCP4:`minikube ip`:30400"`

### Step7

Push the image

`docker push 127.0.0.1:30400/monitor-scale:`git rev-parse --short HEAD``

### Step8

Stop the registry proxy

`docker stop socat-registry`

### Step9

Verify that the image is in our local registry using the registry-ui

`minikube service registry-ui`

### Step10

Create the deployment and service for the monitoring and scaling server and wait for it to be deployed

`sed 's#127.0.0.1:30400/monitor-scale:latest#127.0.0.1:30400/monitor-scale:'`git rev-parse --short HEAD`'#' applications/monitor/k8s/monitor-scale.yaml | kubectl apply -f -`

### Step11

Wait for the deployment to run

`kubectl rollout status deployment/monitor-scale`

### Step12

See the montior-scale-* pod running using kubectl.

`kubectl get pods`

### Step13

See the montior-scale-* service is setup using kubectl.

`kubectl get services`

### Step14

See the montior-scale-* ingress is configured using kubectl.

`kubectl get ingress`

### Step15

See the monitor-scale deployment is setup using kubectl

`kubectl get deployments`

### Step16

Now we will bootstrap the crossword/mongodb services, creating a docker image and storing it in the local registry. This script runs the same steps as before for a different service application.

`scripts/server.sh`

### Step17

Check to see if services has been deployed

`kubectl rollout status deployment/services`

### Step18

Bootstrap the frontend web application.  This script follows the same steps as before but

`scripts/pages.sh`

### Step19

Check to see if the front end has been deployed

`kubectl rollout status deployment/kr8sswordz`

### Step20

See all the pods running using kubectl.

`kubectl get pods`

### Step21

Start the web application in your default browser

`minikube service kr8sswordz`