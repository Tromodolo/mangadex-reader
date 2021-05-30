import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { ChapterList, MangaResponse } from "../Api";
import FetchCover from "../Api/FetchCover";
import FetchManga from "../Api/FetchManga";
import FetchMangaChapters from "../Api/FetchMangaChapters";

export default function Manga() {
	const [isLoading, setIsLoading] = useState(true);
	const [manga, setManga] = useState<MangaResponse>();
	const [cover, setCover] = useState("");
	const [chapters, setChapters] = useState<ChapterList>();
	const { id } = useParams<{id: string}>();
	const history = useHistory();

	const goBack = () => {
		history.goBack();
	};

	useEffect(() => {
		const fetchData = async () => {
			let mangaRes = await FetchManga(id);
			let chapterRes = await FetchMangaChapters(id);
	
			if (mangaRes.data?.attributes?.description?.en?.includes('[')) {
				mangaRes.data.attributes.description.en =
					mangaRes.data.attributes.description.en.split('[')[0];
			}

			const coverRel = mangaRes?.relationships?.find((x) => x.type === "cover_art");
			if (coverRel) {
				const cover = await FetchCover(coverRel.id ?? "");
				setCover(`https://uploads.mangadex.org/covers/${mangaRes.data?.id}/${cover.data?.attributes?.fileName}`);
			}

			setManga(mangaRes);
			setChapters(chapterRes);
			setIsLoading(false);
		};
		fetchData();
	}, [id]);

	return (
		<body className="bg-gray-800">
			<div className="container mx-auto">
				<div className="w-full min-h-screen flex flex-col items-center pt-32 pb-16">
					<div className="w-3/4">
						<button onClick={goBack} className="bg-orange-300 text-gray-700 hover:bg-orange-400 hover:text-gray-100 font-bold py-2 px-4 rounded mr-auto">Go back</button>
					</div>
					{isLoading ? (
						<div className="container mx-auto">
							<div className="w-full min-h-screen flex flex-col items-center pt-32 pb-16">
								<h1 className="text-4xl w-full text-center block text-gray-300 text-sm font-bold mb-8">MangaDex Viewer</h1>
								<h3 className="text-lg font-semibold text-gray-400 p-8">Fetching manga...</h3>
							</div>
						</div>
					) : (
						<>
							<div className="flex flex-col md:flex-row items-center mt-4 bg-gray-300 w-3/4 flex flex-row shadow-md py-3 px-4 text-gray-700 rounded focus:outline-none focus:shadow-outline text-lg text-white">
								{cover && (
									<img className="rounded w-64 max-w-1/4 object-contain" src={cover} alt={`Logo for ${manga?.data?.attributes?.title?.en}`} />
								)}
								<div className="flex flex-col px-4">
									<h2 className="text-2xl font-bold text-gray-700">{manga?.data?.attributes?.title?.en}</h2>
									<h3 className="text-lg font-semibold text-gray-500">Status: {manga?.data?.attributes?.status ?? "Unknown"}</h3>
									<p className="text-sm my-4" dangerouslySetInnerHTML={{__html: manga?.data?.attributes?.description?.en ?? ""}}></p>
								</div>
							</div>
							<h3 className="text-lg font-semibold text-gray-400 p-8 px-8 w-3/4 text-center">Chapters</h3>
							{chapters?.results?.map((chapter) => (
								<Link key={chapter?.data?.id ?? ""} to={`/read/${manga?.data?.id}/${chapter?.data?.id}`} className=" mt-4 rounded bg-gray-300 w-3/4 flex flex-row items-center justify-center shadow-md py-3 px-4 text-gray-700 hover:bg-orange-100 focus:outline-none focus:shadow-outline text-lg text-white">
									<div className="flex flex-col w-1/2">
										<span className="text-xl font-bold text-gray-600">Chapter {chapter?.data?.attributes?.chapter}</span>
										<span className="text-sm" dangerouslySetInnerHTML={{__html: chapter?.data?.attributes?.title ?? ""}}></span>
									</div>
									<span className="text-sm text-gray-500 w-1/2 text-right">{new Date(chapter?.data?.attributes?.createdAt ?? 0).toLocaleDateString()}</span>
								</Link>
							))}
						</>
					)}
				</div>
			</div>
			<div className="absolute top-4 w-full text-center text-gray-300 text-md">
				This site is not officially affiliated with MangaDex
			</div>
		</body>
	);
}