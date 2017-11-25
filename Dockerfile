FROM registry.pro-eu-west-1.openshift.com/looped-lines/web-app-builder-base

WORKDIR /root/project

ENTRYPOINT ["/usr/bin/ts-node", "/usr/bin/gulp"]