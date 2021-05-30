import React, { FormEvent } from "react";
import { useHistory } from "react-router-dom";

export default function Home() {
	const history = useHistory();

	const search = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		history.push(`/search?title=${(evt.currentTarget.elements[0] as HTMLInputElement).value}`);
	};

	return (
		<div className="bg-gray-800">
			<div className="container mx-auto">
				<div className="w-full min-h-screen flex flex-col items-center justify-center">
					<h1 className="text-4xl w-full text-center block text-gray-300 text-sm font-bold mb-8">MangaDex Viewer</h1>
					<div className="flex flex-col items-center justify-center w-full">
						<form className="w-3/4 py-16 md:px-16 flex flex-row" onSubmit={search}>
							<input name="title" placeholder="Search for manga" className="bg-gray-200 shadow appearance-none border rounded-l w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg text-white placeholder-gray-500" />
							<button className="bg-orange-400 hover:bg-orange-500 text-gray-100 font-bold py-2 rounded-r px-8">Go</button>
						</form>
					</div>
				</div>
			</div>
			<div className="absolute top-4 w-full text-center text-gray-300 text-md">
				This site is not officially affiliated with MangaDex
			</div>
		</div>
	);
}