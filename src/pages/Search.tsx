import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {  Link, Redirect, useHistory, useLocation } from "react-router-dom";
import { MangaList } from "../Api";
import FetchCover from "../Api/FetchCover";
import SearchManga from "../Api/SearchManga"

function useQuery() {
	const { search } = useLocation();
	const [params, setParams] = useState<URLSearchParams>(new URLSearchParams(search));
	useEffect(() => {
		console.log(123);
		setParams(new URLSearchParams(search));
	}, [search]);
	return params;
}

export default function Search() {
	const query = useQuery();
	const history = useHistory();
	const [isLoading, setIsLoading] = useState(true);
	const [failed, setFailed] = useState(false);
	const [results, setResults] = useState<MangaList>();
	const [covers, setCovers] = useState<string[]>([]);
	const [searched, setSearched] = useState(query.get("title") ?? "");

	const fetchData = useCallback(async (name: string, offset: number) => {
		setIsLoading(true);
		setCovers([]);
		let searchRes;
		try {
			searchRes = await SearchManga(name!, offset);
		} catch {
			searchRes = {
				results: [],
				total: 0,
			};
		}
		searchRes?.results?.forEach(async (val) => {
			if (val?.data?.attributes?.description?.en) {
				val.data.attributes.description.en = val.data.attributes.description.en.split('\n')[0];
			}
		});

		let coverArr: string[] = [];
		await Promise.all((searchRes.results ?? []).map(async (val, index) => {
			const coverRel = val?.relationships?.find((x) => x.type === "cover_art");
			if (coverRel) {
				const cover = await FetchCover(coverRel.id ?? "");
				coverArr[index] = `https://uploads.mangadex.org/covers/${val.data?.id}/${cover.data?.attributes?.fileName}`;
			}
		}));

		setCovers(coverArr);
		setResults(searchRes);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		const name = query.get("title");
		if (!name) {
			setFailed(true);
		}
		let offset = query.get("offset");
		if (!name) {
			setFailed(true);
		}
		if (!offset) {
			offset = '0';
		}
		fetchData(name ?? "", parseInt(offset));
	}, []);

	const search = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		// This is mostly here to update the URL, so you can copy paste
		history.push(`/search?title=${(evt.currentTarget.elements[0] as HTMLInputElement).value}`);
		fetchData((evt.currentTarget.elements[0] as HTMLInputElement).value, 0);
		setSearched((evt.currentTarget.elements[0] as HTMLInputElement).value);
	};

	if (failed) {
		return <Redirect to="/" />;
	}

	return (
		<div className="bg-gray-800">
			{isLoading ? (
				<div className="container mx-auto">
					<div className="w-full min-h-screen flex flex-col items-center pt-32 pb-16">
						<h1 className="text-4xl w-full text-center block text-gray-300 text-sm font-bold mb-8">MangaDex Viewer</h1>
						<h3 className="text-lg font-semibold text-gray-400 p-8">Finding results...</h3>
					</div>
				</div>
			) : (
				<>
					<div className="container mx-auto">
						<div className="w-full min-h-screen flex flex-col items-center pt-32 pb-16">
							<h1 className="text-4xl w-full text-center block text-gray-300 text-sm font-bold mb-8">MangaDex Viewer</h1>
							<form className="w-3/4 flex flex-row" onSubmit={search}>
								<input defaultValue={searched} name="title" placeholder="Search for manga" className="bg-gray-200 shadow appearance-none border rounded-l w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg text-white placeholder-gray-500" />
								<button className="bg-orange-400 hover:bg-orange-500 text-gray-100 font-bold py-2 px-4 rounded-r shadow-md">Go</button>
							</form>
							{results?.results?.map((manga, index) => (
								<Link key={manga.data?.id ?? ""} to={`manga/${manga.data?.id ?? 0}`} className="flex flex-col md:flex-row items-center mt-4 bg-gray-300 rounded w-3/4 flex flex-row shadow-md py-3 px-4 text-gray-700 hover:bg-orange-100 focus:outline-none focus:shadow-outline text-lg text-white">
									<img className="rounded w-32 object-contain" src={covers[index]} alt={`Logo for ${manga.data?.attributes?.title?.en}`} />
									<div className="flex flex-col px-4">
										<h2 className="text-2xl font-bold text-gray-700">{manga.data?.attributes?.title?.en}</h2>
										<h3 className="text-lg font-semibold text-gray-400">Status: {manga.data?.attributes?.status}</h3>
										<p className="text-sm my-4" dangerouslySetInnerHTML={{__html: manga.data?.attributes?.description?.en ?? ""}}></p>
									</div>
								</Link>
							))}
							{(results?.total ?? 0) === 0 && (
								<h3 className="text-lg font-semibold text-gray-400 p-8">No results found</h3>
							)}
						</div>
					</div>
					<div className="absolute top-4 w-full text-center text-gray-300 text-md">
						This site is not officially affiliated with MangaDex
					</div>
				</>
			)}
		</div>
	);
}
