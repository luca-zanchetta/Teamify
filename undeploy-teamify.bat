echo & echo. & echo. & echo.********************************************************** & echo. & echo.ATTENTION! This script will COMPLETELY uninstall Teamify, removing also all the images and the database data. Are you sure to undeploy? & echo. & echo.********************************************************** & echo. & echo.
pause
docker compose down
docker image rm teamify-frontend
docker image rm teamify-backend
docker image rm teamify-backend-backup
docker image rm teamify-db
docker image rm teamify-db-backup
docker volume rm teamify_db-data
echo & echo. & echo.Teamify successfully undeployed. & echo. & echo. 
pause