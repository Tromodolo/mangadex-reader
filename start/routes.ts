import Route from '@ioc:Adonis/Core/Route';
import { Group, MangaList } from 'App/Api';
import FetchChapter from 'App/Api/FetchChapter';
import FetchManga from 'App/Api/FetchManga';
import FetchMangaChapters from 'App/Api/FetchMangaChapters';
import SearchManga from 'App/Api/SearchManga';
import GetMHUrl from 'App/Api/GetMHURl';
import FetchGroup from 'App/Api/FetchGroup';

Route.get('/', async ({ view }) => {
	return view.render('welcome');
});

Route.get('/search', async ({ request, view, params }) => {
	const query = request.qs();
	const name = query['title'];
	let offset = query['offset'];
	if (!name) {
		return view.render('welcome');
	}
	if (!offset) {
		offset = '0';
	}

	let searchRes: MangaList;
	try {
		searchRes = await SearchManga(name, parseInt(offset));
	} catch {
		searchRes = {
			results: [],
			total: 0,
		};
	}
	searchRes.results.forEach((val) => {
		val.data.attributes.description.en = val.data.attributes.description.en.split('\n')[0];
	});

	return view.render('search', {
		searchedFor: name,
		results: searchRes,
		offset,
	});
});

Route.get('/manga/:id', async ({ view, params }) => {
	try {
		let mangaRes = await FetchManga(params.id);
		let chapterRes = await FetchMangaChapters(params.id);

		if (mangaRes.data.attributes.description.en?.includes('[')) {
			mangaRes.data.attributes.description.en =
				mangaRes.data.attributes.description.en.split('[')[0];
		}

		if (mangaRes.result === 'error') {
			return view.render('welcome');
		} else {
			return view.render('manga', {
				manga: mangaRes,
				chapters: chapterRes,
			});
		}
	} catch {
		return view.render('welcome');
	}
});

Route.get('/read/:id/:chapterNum', async ({ view, params }) => {
	try {
		let mangaRes = await FetchManga(params.id);
		let chapterListRes = await FetchMangaChapters(params.id);
		let chapterRes = await FetchChapter(params.chapterNum);
		let mangadexAtHome = await GetMHUrl(chapterRes.data.id);

		if (chapterListRes.result === 'error' || chapterRes.result === 'error') {
			return view.render('welcome');
		} else {
			const chapterIndex = chapterListRes.results.findIndex(
				(x) => x.data.id === chapterRes.data.id
			);
			let nextChapter = '';
			let prevChapter = '';
			if (chapterIndex + 1 < chapterListRes.results?.length) {
				nextChapter = `/read/${mangaRes.data.id}/${
					chapterListRes.results[chapterIndex + 1].data.id
				}`;
			}
			if (chapterIndex !== 0) {
				prevChapter = `/read/${mangaRes.data.id}/${
					chapterListRes.results[chapterIndex - 1].data.id
				}`;
			}

			let images: string[] = [];
			for (const filename of chapterRes.data.attributes.data) {
				images.push(
					`${mangadexAtHome.baseUrl}/data/${chapterRes.data.attributes.hash}/${filename}`
				);
			}

			return view.render('read', {
				manga: mangaRes,
				chapterList: chapterListRes,
				chapterNum: chapterIndex + 1,
				chapter: chapterRes,
				images,
				nextChapter,
				prevChapter,
			});
		}
	} catch (e) {
		console.error(e);
		return view.render('welcome');
	}
});
