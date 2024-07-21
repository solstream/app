npm install

npm run build:prod

docker build -t stream_app .

docker run -m=100m -d -p 4200:80 stream_app:latest
