---
title: "Installing and using minikube"
date: 2023-07-09T09:00:00Z
tags:
     - kubernetes
images:
  - src: "/images/posts/pexels-emmanuel-codden-16853020.jpg"
    alt: "Local Kubernetes: Installing and using minikube"
url: "/posts/2023-07/installing-and-using-minikube/"
---

In my current project, we use *Kubernetes* massively and with that, I needed to perform tests more than once to verify that my *deployment* file was correct. Although there are environments that I could use to test, I decided to use *minikube*, in order to carry out tests locally and not risk impacting other users/applications.

## Installation

The *minikube* package is available for *macOS*, *Linux* and *Windows* platforms, however, I will only demonstrate how to install it on *macOS* using *Homebrew*. If you want to install on other platforms or with a different method, just check the options [here](https://minikube.sigs.k8s.io/docs/start/).

### Installation on macOS with Homebrew

The *minikube* package is available on *Homebrew* and can be installed using the following command:

```bash
brew install minikube
```

This way, not only *minikube* will be installed, but also the *kubernetes-cli* package, necessary to access *Kubernetes* resources through the terminal.

## Cluster initialization

To initialize a *Kubernetes* *cluster* using *minikube*, just open a terminal and run the following command:

```bash
minikube start
```

With this command, a *cluster* will be initialized and also the local settings to access via the *kubectl* command will be defined.

The creation of this *cluster*, preferably, will be in a *Docker* container, however, if this is not available, other methods can be used. The *minikube* command is in charge of identifying the available methods (drivers) and using them.

It is possible to specify which driver to use, for that, just add an argument specifying which driver you want to use, as in the following example, in which the use of *Hyperkit* is specified.

```bash
# minikube start --driver=<driver name>
# eg:
minikube start --driver=hyperkit
```

There is also the option of defining a driver as default, so that whenever the *cluster* is created, this is the method used. To do so, just run the following command, changing it to the desired driver.

```bash
# minikube config set driver <driver name>
# It is.:
minikube config set driver hyperkit
```

For more details on supported drivers, I recommend checking the [official documentation](https://minikube.sigs.k8s.io/docs/drivers/), which also details differences, customizations, and limitations for each driver.

## Access to the dashboard (web interface)

The *cluster* created with *minikube* provides a *dashboard* which can be accessed using the following command:

```bash
minikube dashboard
```

Executing this command should automatically open your default browser, however, if it happens, in the terminal output it is possible to identify which URL should be used to access the *dashboard*.

<aside>
💡 This *dashboard* allows you to view, create, modify and remove the resources available in the *cluster* through a web interface, as is possible when using the client via a terminal (*`kubectl`*)

</aside>

## Access to a service or ingress

When creating a *service* of type *LoadBalancer* or even creating an *Ingress*, to access it it is necessary to execute the following command in terminal:

```bash
minikube tunnel
```

For the specific case of *Ingress*, it is still necessary to install an *addon* in Kubernetes. To do this, just run the following command:

```bash
minikube addons enable ingress
```

## Stop or Remove the cluster

The process of stopping the *cluster* can be performed using the following command in a terminal:

```bash
minikube stop
```

This command only pauses the *cluster* and, consequently, releases the used resources (CPU/Memory) to the host. When running the `minikube start` command again, this same *cluster* is recovered, with all the modifications made so far.

If you want to remove the *cluster*, the command to be executed will be:

```bash
minikube delete
```

This command will also remove all persisted data, ie when the `minikube start` command is executed, a new *cluster* will be created.

## Conclusion

Although not detailed in this text, several other features and customizations are available in *minikube*, some in *addons* format, which can be seen using the following command:

```bash
minikube addons list
```

In summary, *minikube* is useful for anyone who wants or needs to carry out tests in a *cluster* *Kubernetes* locally, because, in addition to being easy to install, it is also possible to install several extensions that can greatly facilitate its development and/or or application testing.
