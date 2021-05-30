import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Manga from "./pages/Manga";
import Read from "./pages/Read";

export default function Routes() {
  return (
	<Router>
		<Switch>
          	<Route path="/search">
		  		<Search />
          	</Route>
          	<Route path="/manga/:id">
		  		<Manga />
          	</Route>
          	<Route path="/read/:mangaId/:chapterId">
            	<Read />
          	</Route>
			  <Route path="/">
				<Home />
          	</Route>
		</Switch>
    </Router>
  );
}
