import * as React from "react";
import RelayEnvironment from "../relay/RelayEnvironment";
import Newsfeed from "./Newsfeed";
import LoadingSpinner from "./LoadingSpinner";
import PreloadingEnvironment from "./PreloadingEnvironment";

export default function App(): React.ReactElement {
  return (
    <RelayEnvironment>
      <React.Suspense
        fallback={
          <div className="app-loading-spinner">
            <LoadingSpinner />
          </div>
        }
      >
        <PreloadingEnvironment>
          <div className="app">
            <Newsfeed />
          </div>
        </PreloadingEnvironment>
      </React.Suspense>
    </RelayEnvironment>
  );
}
