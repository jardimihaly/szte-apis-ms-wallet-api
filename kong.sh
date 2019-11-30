curl \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"name": "api-upstream"}' \
    http://localhost:8001/upstreams

curl \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"target": "api-1:5000", "weight": 100}' \
    http://localhost:8001/upstreams/api-upstream/targets

curl \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"target": "api-2:5001", "weight": 50}' \
    http://localhost:8001/upstreams/api-upstream/targets

curl -X POST http://localhost:8001/services \
    -d 'name=api' \
    -d 'host=api-upstream'
    -d 'protocol=http'

curl -X POST http://localhost:8001/services/api/routes \
    -d 'paths[]=/'

curl -X POST http://localhost:8001/services/api/plugins \
    -d 'name=rate-limiting' \
    -d 'config.second=5' \
    -d 'config.hour=1000' \
    -d 'config.policy=local'