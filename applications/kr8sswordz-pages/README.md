## Kr8ssword Puzzle Kubernetes CI / CD , Microservices Example
## NOTE: For full functionality please ensure the part2/server setup has been completed.

# setup
Go through part1. Ensure that:
 - europa is up and running

### Update k8s/deployment.yaml to replace MINIKUBEIP with your minikube ip
    host: kr8sswordz.MINIKUBEIP.xip.io

## Manual steps to build and deploy
### Build and Push to Europa
    docker build -t `minikube ip`:30912/kr8sswordz:1.0.0 .
    docker push `minikube ip`:30912/kr8sswordz:1.0.0

### Make europa Repo public
Note: Replace MINIKUBEIP with your minikube ip

1) Go to http://europa.MINIKUBEIP.xip.io/repositories/kr8sswordz
2) Go to repository settings 
3) Select Public

### Deploy to kubernetes
    kubectl apply -f k8s/deployment.yaml
        
## Automated script
    ./build.sh
    
## Load application
Change MINIKUBEIP to your minikube ip and load the application below

    http://kr8sswordz.MINIKUBEIP.xip.io/ 
