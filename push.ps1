$json = Get-Content back/package.json | ConvertFrom-Json
$version = Select-Object -InputObject ${json} -ExpandProperty "version"
$name = Select-Object -InputObject ${json} -ExpandProperty "name"
echo "Pushing ${name} v${version}"
docker build -t saramorillon/${name} .
docker image tag saramorillon/${name} saramorillon/${name}:${version}
docker push saramorillon/${name}:${version}
docker push saramorillon/${name}:latest
echo "Done"
