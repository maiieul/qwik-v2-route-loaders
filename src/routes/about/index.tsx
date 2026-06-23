import { component$, useAsync$ } from "@qwik.dev/core";
import { routeLoader$, useLocation } from "@qwik.dev/router";

export const useLoader1 = routeLoader$(
  async ({ error, url }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (url.searchParams.has("loader")) {
      return error(500, { message: "loader error!" });
    }

    return { message: "Hello from routeLoader$!" };
  },
  { expires: 1000, search: ["loader"], allowStale: true },
);

const Child = component$(() => {
  const loc = useLocation();

  const result = useAsync$(async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (loc.url.searchParams.has("async")) {
      throw new Error("useAsync$ error!");
    }

    return { message: "Hello from useAsync$!" };
  });

  if (result.loading) return <p>Loading...</p>;
  if (result.error) return <p>Error: {result.error.message}</p>;
  return (
    <>
      This is a test
      <p>{result.value.message}</p>
    </>
  );
});

export default component$(() => {
  const loader1 = useLoader1();
  if (loader1.loading) return <p>Loading...</p>;
  if (loader1.error) return <p>Error: {loader1.error.message}</p>;

  return (
    <div>
      <h1>About page</h1>
      <p>{loader1.value.message}</p>
      <div
        style={{
          border: "1px solid black",
          padding: "10px",
          marginTop: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        {/* <Child /> */}
      </div>
    </div>
  );
});
