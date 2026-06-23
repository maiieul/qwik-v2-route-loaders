import { component$, useAsync$ } from "@qwik.dev/core";
import { routeLoader$, useLocation } from "@qwik.dev/router";

type Joke = {
  joke?: string;
  setup?: string;
  delivery?: string;
};

export const useLoader1 = routeLoader$(
  async ({ error, url }) => {
    console.log("loader1 called");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("loader1 setTimeout finished");

    const query = url.searchParams.get("query")?.trim();
    const apiUrl = new URL(
      "https://v2.jokeapi.dev/joke/Programming?safe-mode&amount=2",
    );

    if (query) {
      apiUrl.searchParams.set("contains", query);
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw error(500, { message: "Failed to fetch jokes" });
    }

    const data = (await response.json()) as { jokes?: Joke[] };
    console.log("loader1 finished");
    return data.jokes ?? [];
  },
  { expires: 1000, allowStale: false, poll: true },
);

export const useLoader2 = routeLoader$(
  async ({ resolveValue }) => {
    console.log("loader2 called");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("loader2 setTimeout finished");
    const result = await resolveValue(useLoader1);
    console.log("loader2 finished");
    return { ...result, message: "Hello from routeLoader 2!" };
  },
  { expires: 1000, allowStale: false, poll: true },
);

export default component$(() => {
  const loader1 = useLoader1();
  const loader2 = useLoader2();
  if (loader1.loading) return <p>Loading...</p>;
  if (loader1.error) return <p>Error: {loader1.error.message}</p>;

  return (
    <div>
      <h1>Home page</h1>
      {loader1.value.length === 0 ? (
        <p>No jokes found</p>
      ) : (
        <ul>
          {loader1.value.map((joke, i) => (
            <li key={i} style={{ whiteSpace: "pre-wrap" }}>
              {joke.joke ?? `${joke.setup}\n${joke.delivery}`}
            </li>
          ))}
        </ul>
      )}
      <p>{loader2.value.message}</p>
      <div
        style={{
          border: "1px solid black",
          padding: "10px",
          marginTop: "10px",
          backgroundColor: "#f0f0f0",
        }}
      ></div>
    </div>
  );
});
