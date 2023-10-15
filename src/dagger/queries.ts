import { gql } from "../../deps.ts";

export const test = gql`
  query test($src: String!) {
    test(src: $src)
  }
`;
