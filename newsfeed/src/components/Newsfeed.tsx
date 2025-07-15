import * as React from "react";
import {
  graphql,
  useLazyLoadQuery,
  usePreloadedQuery,
  PreloadedQuery,
} from "react-relay";
import Story, { StandaloneStory } from "./Story";
import type { NewsfeedQuery as NewsfeedQueryType } from "./__generated__/NewsfeedQuery.graphql";
import { usePreloadingEnvironmentQuery } from "./PreloadingEnvironment";

export const NewsfeedQuery = graphql`
  query NewsfeedQuery($ids: [ID!]!) {
    storiesByIds(ids: $ids) {
      ...StoryFragment
    }
  }
`;

function NewsfeedContent({ data }: { data: NewsfeedQueryType["response"] }) {
  const stories = data.storiesByIds;

  return (
    <div className="newsfeed">
      {stories.map((story, index) => (
        <Story key={index} story={story} />
      ))}
    </div>
  );
}

function PreloadedNewsfeed({
  queryRef,
}: {
  queryRef: PreloadedQuery<NewsfeedQueryType>;
}) {
  console.log("PreloadedNewsfeed using queryRef", queryRef);
  const data = usePreloadedQuery<NewsfeedQueryType>(NewsfeedQuery, queryRef);
  return <NewsfeedContent data={data} />;
}

function LazyNewsfeed() {
  console.log("LazyNewsfeed loading query...");
  const data = useLazyLoadQuery<NewsfeedQueryType>(NewsfeedQuery, { ids: ["2", "3"] });
  return <NewsfeedContent data={data} />;
}

function SuperLazyNewsfeed({queryRef}: {queryRef: PreloadedQuery<NewsfeedQueryType, Record<string, unknown>>}) {
  console.log("SuperLazyNewsfeed loading story by story...");
  const data = usePreloadedQuery(NewsfeedQuery, queryRef);
  console.log("Finished preloading: ", data);

  const [shouldLoad, setShouldLoad] = React.useState(false);
  
  return <>
    <button onClick={() => setShouldLoad(true)}>Load stories</button>
    {shouldLoad && ["2", "3"].map(id => (
      <StandaloneStory key={id} id={id} />
    ))}
  </>;
}

export default function Newsfeed() {
  const { mode, queryRef } = usePreloadingEnvironmentQuery();

  switch (mode) {
    case "preloaded":
      return queryRef ? <PreloadedNewsfeed queryRef={queryRef} /> : null;
    case "cached":
      return queryRef ? <LazyNewsfeed /> : null;
    default:
      return queryRef ? <SuperLazyNewsfeed queryRef={queryRef} /> : null;
  }

  return <LazyNewsfeed />;
}
