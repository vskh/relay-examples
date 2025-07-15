import * as React from "react";
import { useEffect } from "react";
import { PreloadedQuery, useQueryLoader } from "react-relay";
import type { NewsfeedQuery as NewsfeedQueryType } from "./__generated__/NewsfeedQuery.graphql";
import { NewsfeedQuery } from "./Newsfeed";

type PreloadingEnvironmentContextType = {
  mode: "lazy" | "preloaded" | "cached";
  queryRef?: PreloadedQuery<NewsfeedQueryType>;
};

const PreloadingEnvironmentContext =
  React.createContext<PreloadingEnvironmentContextType>({
    mode: "lazy",
  });

export const usePreloadingEnvironmentQuery = () =>
  React.useContext(PreloadingEnvironmentContext);

export default function PreloadingEnvironment({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [queryRef, loadQuery] =
    useQueryLoader<NewsfeedQueryType>(NewsfeedQuery);

  useEffect(() => {
    console.log("Kicking off query preloading...");
    loadQuery({ ids: ["2", "3", "4"] });
  }, []);

  console.log("PreloadingEnvironment queryRef", queryRef);

  return (
    <PreloadingEnvironmentContext.Provider
      value={{ mode: "lazy", queryRef }}
    >
      {children}
    </PreloadingEnvironmentContext.Provider>
  );
}
