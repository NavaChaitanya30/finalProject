cd /home/lenovo/Desktop/finalProject/nitW-project-backend/BasicNetwork-2.0/artifacts/
docker-compose down
cd /home/lenovo/Desktop/finalProject/nitW-project-backend/BasicNetwork-2.0/artifacts/channel
./create-artifacts.sh
sleep 3
 cd ../..
# docker-compose up -d
# sleep 10
# cd ..
# ./createChannel.sh
# sleep 5
# ./deployChaincode.sh
./up.sh
sleep 2
./queryAttacks.sh | jq
cd api-1.4/
nodemon app.js 
clear
echo "++++++++++++SERVER STOPPED++++++++++++ "
echo "============SHUTTING DOWN THE DOCKER IMAGES============"
cd /home/lenovo/Desktop/finalProject/nitW-project-backend/BasicNetwork-2.0/artifacts/
docker-compose down
