/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route';
import SearchManga from 'App/Api/SearchManga';

Route.get('/', async ({ view }) => {
	return view.render('welcome');
});

Route.get('/search/:name', async ({ view, params }) => {
	const searchRes = await SearchManga(params.name);
	return view.render('search', {
		searchedFor: params.name,
		results: searchRes,
	});
});

Route.get('/manga/:id', async ({ view }) => {
	return view.render('welcome');
});

Route.get('/read/:id/:chapterNum', async ({ view, route }) => {
	
	return view.render('welcome');
});