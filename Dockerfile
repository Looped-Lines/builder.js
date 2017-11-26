FROM loopedlines/javascript-app-builder-base

WORKDIR /root/project

ENTRYPOINT ["/usr/bin/ts-node", "/usr/bin/gulp"]