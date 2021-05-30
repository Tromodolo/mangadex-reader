import React, { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ChapterList, ChapterResponse, MangaResponse } from "../Api";
import FetchChapter from "../Api/FetchChapter";
import FetchManga from "../Api/FetchManga";
import FetchMangaChapters from "../Api/FetchMangaChapters";
import FetchMangaDexAtHome from "../Api/FetchMangaDexAtHome";

export default function Read() {
	const [isLoading, setIsLoading] = useState(true);
	const [manga, setManga] = useState<MangaResponse>();
	const [chapterList, setChapterList] = useState<ChapterList>();
	const [currentChapter, setCurrentChapter] = useState<ChapterResponse>();
	const [images, setImages] = useState<string[]>();
	const [nextChapterUrl, setNextChapterUrl] = useState("");
	const [previousChapterUrl, setPreviousChapterUrl] = useState("");
	const { mangaId, chapterId } = useParams<{mangaId: string, chapterId: string}>();
	const history = useHistory();

	const toMangaPage = () => {
		history.push(`/manga/${manga?.data?.id ?? ""}`);
	};

	const toPrev = () => {
		history.push(previousChapterUrl);
	};

	const toNext = () => {
		history.push(nextChapterUrl);
	}

	const toChapter = (event: SyntheticEvent<HTMLSelectElement, Event>) => {
		event.preventDefault();
		history.push(`/read/${manga?.data?.id ?? ""}/${(event.target as HTMLSelectElement)?.value}`);
	};

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			let chapterRes = await FetchChapter(chapterId);
			let mangadexAtHome = await FetchMangaDexAtHome(chapterRes?.data?.id ?? "");
			let mangaRes = await FetchManga(mangaId);
			let chapterListRes = await FetchMangaChapters(mangaId);

			const chapterIndex = chapterListRes?.results?.findIndex((x) => x.data?.id === chapterRes.data?.id) ?? -1;
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

			setNextChapterUrl(nextChapter);
			setPreviousChapterUrl(prevChapter);
			setImages(images);
			setCurrentChapter(chapterRes);
			setChapterList(chapterListRes);
			setManga(mangaRes);
			setIsLoading(false);
		}
		fetchData();
	}, [mangaId, chapterId]);

	return (
		<body className="bg-gray-800">
			<div className="container mx-auto">
				{isLoading ? (
					<div className="container mx-auto">
						<div className="w-full min-h-screen flex flex-col items-center pt-32 pb-16">
							<h1 className="text-4xl w-full text-center block text-gray-300 text-sm font-bold mb-8">MangaDex Viewer</h1>
							<h3 className="text-lg font-semibold text-gray-400 p-8">Fetching chapter...</h3>
						</div>
					</div>
				) : (
					<>
						<div className="w-full min-h-screen flex flex-col items-center pt-32 pb-16">
							<div className="w-full px-8 md:px-0 md:w-2/3 flex flex-col">
								<button onClick={toMangaPage} className="bg-orange-300 text-gray-700 hover:bg-orange-400 hover:text-gray-100 font-bold py-2 px-4 rounded mr-auto">Go back to chapter list</button>
								<div className="flex flex-row justify-between items-center mt-12">
									{previousChapterUrl ? (
										<button onClick={toPrev} className="bg-orange-300 text-gray-700 hover:bg-orange-400 hover:text-gray-100 font-bold py-2 px-4 rounded">Previous</button>
									) : (
										<button disabled={true} className="bg-gray-200 text-gray-500 font-bold py-2 px-4 rounded">Previous</button>
									)}
									<select className="w-1/3" id="chapter-select" value={currentChapter?.data?.id} onChange={toChapter}>
										{chapterList?.results?.map((chpt) => {
											return (
												<option value={chpt?.data?.id} key={chpt?.data?.id}>
													Chapter {chpt?.data?.attributes?.chapter}
												</option>
											)
										})}
									</select>
									{nextChapterUrl ? (
										<button onClick={toNext} className="bg-orange-300 text-gray-700 hover:bg-orange-400 hover:text-gray-100 font-bold py-2 px-4 rounded">Next</button>
									) : (
										<button disabled={true} className="bg-gray-200 text-gray-500 font-bold py-2 px-4 rounded">Next</button>
									)}
								</div>
							</div>
							<h3 className="text-lg font-semibold text-gray-400 p-8">{manga?.data?.attributes?.title?.en} - Chapter {currentChapter?.data?.attributes?.chapter}</h3>
							{images?.map((img, index) => {
								return <img className="my-1" alt={`Page ${index+1}`} src={img} key={img} loading="lazy"/>;
							})}
						</div>
					</>
				)}
			</div>
			<div className="absolute top-4 w-full text-center text-gray-300 text-md">
				This site is not officially affiliated with MangaDex
			</div>
		</body>
	);
}