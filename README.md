For testing purposes:

Backend -> after pulling , run these commands

cd backend

composer install

composer require fruitcake/laravel

composer require laravel/sanctum

=> Then edit the .env file to connect the database 

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tymstamp
DB_USERNAME=root
DB_PASSWORD=

php artisan migrate:fresh --seed

php artisan serve

Frontend ->

cd frontend

cd my-app

npm install

npm start
