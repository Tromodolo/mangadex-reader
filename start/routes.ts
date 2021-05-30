import Route from '@ioc:Adonis/Core/Route';
import { MangaList } from 'App/Api';
import FetchChapter from 'App/Api/FetchChapter';
import FetchManga from 'App/Api/FetchManga';
import FetchMangaChapters from 'App/Api/FetchMangaChapters';
import SearchManga from 'App/Api/SearchManga';
import FetchMangaDexAtHome from 'App/Api/FetchMangaDexAtHome';
import FetchCover from 'App/Api/FetchCover';

Route.get('/', async ({ view }) => {
	return view.render('welcome');
});

Route.get('/search', async ({ request, view }) => {
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
	searchRes?.results?.forEach((val) => {
		if (val?.data?.attributes?.description?.en) {
			val.data.attributes.description.en = val.data.attributes.description.en.split('\n')[0];
		}
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

		console.log(chapterRes);

		if (mangaRes.data?.attributes?.description?.en?.includes('[')) {
			mangaRes.data.attributes.description.en =
				mangaRes.data.attributes.description.en.split('[')[0];
		}

		const cover = mangaRes?.relationships?.find((x) => x.type === "cover_art");
		let cover_img = "";
		if (cover) {
			const coverRes = await FetchCover(cover.id);
			cover_img = `https://uploads.mangadex.org/covers/${mangaRes.data?.id}/${coverRes.data?.attributes.fileName}`
		}

		if (mangaRes.result === 'error') {
			return view.render('welcome');
		} else {
			return view.render('manga', {
				manga: mangaRes,
				chapters: chapterRes,
				cover: cover_img,
			});
		}
	} catch {
		return view.render('welcome');
	}
});

Route.get('/read/:id/:chapterNum', async ({ view, params, response }) => {
	try {
		let chapterRes = await FetchChapter(params.chapterNum);
		if (!chapterRes?.data?.id) {
			return response.status(500);
		}

		let mangadexAtHome = await FetchMangaDexAtHome(chapterRes.data.id);
		let mangaRes = await FetchManga(params.id);
		let chapterListRes = await FetchMangaChapters(params.id);

		if (chapterListRes.result === 'error' || chapterRes.result === 'error') {
			return view.render('welcome');
		} else {
			const chapterIndex =
				chapterListRes?.results?.findIndex((x) => x.data?.id === chapterRes.data?.id) ?? -1;
			let nextChapter = '';
			let prevChapter = '';
			if (chapterIndex + 1 < (chapterListRes.results?.length ?? 0)) {
				nextChapter = `/read/${mangaRes.data?.id}/${
					chapterListRes.results?.[chapterIndex + 1].data?.id
				}`;
			}
			if (chapterIndex !== 0) {
				prevChapter = `/read/${mangaRes.data?.id}/${
					chapterListRes.results?.[chapterIndex - 1].data?.id
				}`;
			}

			let images: string[] = [];
			for (const filename of chapterRes?.data?.attributes?.data ?? []) {
				images.push(
					`${mangadexAtHome.baseUrl}/data/${chapterRes.data?.attributes?.hash}/${filename}`
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
