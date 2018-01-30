#!/usr/bin/env bash

echo "installing etcd operator"
kubectl  create -f manifests/deployment.yaml
kubectl  rollout status -f manifests/deployment.yaml

until kubectl  get crd cluster.etcd.coreos.com
do
    echo "waiting for operator"
    sleep 2
done

echo "pausing for 10 seconds for operator to settle"
sleep 10

kubectl  create -f manifests/example-etcd-cluster.yaml

echo "installing etcd cluster service"
kubectl  create -f manifests/service.json

echo "waiting for etcd cluster to turnup"

until kubectl  get pod example-etcd-cluster-0002
do
    echo "waiting for etcd cluster to turnup"
    sleep 2
done
