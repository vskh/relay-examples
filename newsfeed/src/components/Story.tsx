import * as React from "react";
import Card from "./Card";
import Heading from "./Heading";
import PosterByline from "./PosterByline";
import StorySummary from "./StorySummary";
import Image from "./Image";
import { useFragment, graphql, useLazyLoadQuery } from "react-relay";
import type { StoryFragment$key } from "./__generated__/StoryFragment.graphql";
import { StoryQuery as StoryQueryType } from "./__generated__/StoryQuery.graphql";

const StoryFragment = graphql`
  fragment StoryFragment on Story {
    __typename
    id
    title
    summary
    createdAt
    poster {
      ...PosterBylineFragment
    }
    thumbnail {
      ...ImageFragment @arguments(width: 400)
    }
  }
`;

const StoryQuery = graphql`
  query StoryQuery($id: ID!) {
    storyById(id: $id) {
      ...StoryFragment
    }
  }
`;

type Props = {
  story: StoryFragment$key
};

export default function Story({ story }: Props): React.ReactElement {
  const data = useFragment(StoryFragment, story);
  return (
    <Card>
      <PosterByline poster={data.poster} />
      <Heading>{data.title}</Heading>
      {/* <Image image={data.thumbnail} width={400} height={400} /> */}
      <StorySummary summary={data.summary} />
    </Card>
  );
}

export function StandaloneStory({ id }: { id: string }): React.ReactElement {
  console.log("Loading data for Story:", id);
  const data = useLazyLoadQuery<StoryQueryType>(StoryQuery, { id }, {fetchPolicy: "store-or-network"});
  console.log("Done: ", data);
  return <Story story={data?.storyById} />;
}