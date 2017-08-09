#!/usr/bin/env bash

echo "installing etcd operator (pinned to v0.4.2)"
kubectl  create -f https://raw.githubusercontent.com/coreos/etcd-operator/7ff99474ece190a5ece01d15d50c06c03bdf17a4/example/deployment.yaml
kubectl  rollout status -f https://raw.githubusercontent.com/coreos/etcd-operator/7ff99474ece190a5ece01d15d50c06c03bdf17a4/example/deployment.yaml

until kubectl  get thirdpartyresource cluster.etcd.coreos.com
do
    echo "waiting for operator"
    sleep 2
done

echo "pausing for 10 seconds for operator to settle"
sleep 10

kubectl  create -f https://raw.githubusercontent.com/coreos/etcd-operator/24eaa92eb4daf7ba569a09499c313d6f78a9e2d8/example/example-etcd-cluster.yaml

echo "installing etcd cluster service"
kubectl  create -f https://raw.githubusercontent.com/coreos/etcd-operator/master/example/example-etcd-cluster-nodeport-service.json

echo "waiting for etcd cluster to turnup"

until kubectl  get pod example-etcd-cluster-0002
do
    echo "waiting for etcd cluster to turnup"
    sleep 2
done
