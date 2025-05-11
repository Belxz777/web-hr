docker build -t web-pulse . 
docker run --rm -p 3000:3000 --name web-pulse  web-pulse