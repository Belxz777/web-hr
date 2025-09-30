docker build -t web-hr . 
docker run -d -p 3500:3500 --name web-hr web-hr