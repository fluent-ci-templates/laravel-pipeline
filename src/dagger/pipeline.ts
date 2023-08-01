import Client, { connect } from "@dagger.io/dagger";
import { test } from "./jobs.ts";

export default function pipeline(src = ".") {
  connect(async (client: Client) => {
    await test(client, src);
  });
}
