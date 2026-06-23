import { component$, Slot, useSignal, useTask$, $ } from "@qwik.dev/core";
import { Link } from "@qwik.dev/router";

export default component$(() => {
  const timer = useSignal(0);

  useTask$(({ track, cleanup }) => {
    track(timer);
    const id = setInterval(() => timer.value++, 1000);
    cleanup(() => clearInterval(id));
  });

  const restartTimer = $(() => {
    timer.value = 0;
    timer.value++;
  });

  return (
    <>
      <Link href="/" onClick$={restartTimer} prefetch={false}>
        Home
      </Link>
      <hr />
      <Link
        href="/about/?loader&async"
        onClick$={restartTimer}
        prefetch={false}
      >
        About
      </Link>
      <hr />
      {timer.value}
      <Slot />
    </>
  );
});
