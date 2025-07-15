#!/bin/sh
podman compose up -d
podman exec -it chartdb-dev-pod /bin/fish