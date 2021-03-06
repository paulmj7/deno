// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
import { assert, unitTest } from "./test_util.ts";

unitTest(function globalThisExists(): void {
  assert(globalThis != null);
});

unitTest(function noInternalGlobals(): void {
  // globalThis.__bootstrap should not be there.
  for (const key of Object.keys(globalThis)) {
    assert(!key.startsWith("_"));
  }
});

unitTest(function windowExists(): void {
  assert(window != null);
});

unitTest(function selfExists(): void {
  assert(self != null);
});

unitTest(function windowWindowExists(): void {
  assert(window.window === window);
});

unitTest(function windowSelfExists(): void {
  assert(window.self === window);
});

unitTest(function globalThisEqualsWindow(): void {
  assert(globalThis === window);
});

unitTest(function globalThisEqualsSelf(): void {
  assert(globalThis === self);
});

unitTest(function globalThisInstanceofWindow(): void {
  assert(globalThis instanceof Window);
});

unitTest(function globalThisConstructorLength(): void {
  assert(globalThis.constructor.length === 0);
});

unitTest(function globalThisInstanceofEventTarget(): void {
  assert(globalThis instanceof EventTarget);
});

unitTest(function navigatorInstanceofNavigator(): void {
  // TODO(nayeemrmn): Add `Navigator` to deno_lint globals.
  // deno-lint-ignore no-undef
  assert(navigator instanceof Navigator);
});

unitTest(function DenoNamespaceExists(): void {
  assert(Deno != null);
});

unitTest(function DenoNamespaceEqualsWindowDeno(): void {
  assert(Deno === window.Deno);
});

unitTest(function DenoNamespaceIsNotFrozen(): void {
  assert(!Object.isFrozen(Deno));
});

unitTest(function webAssemblyExists(): void {
  assert(typeof WebAssembly.compile === "function");
});

declare global {
  namespace Deno {
    // deno-lint-ignore no-explicit-any
    var core: any;
  }
}

unitTest(function DenoNamespaceConfigurable() {
  const desc = Object.getOwnPropertyDescriptor(globalThis, "Deno");
  assert(desc);
  assert(desc.configurable);
  assert(!desc.writable);
});

unitTest(function DenoCoreNamespaceIsImmutable(): void {
  const { print } = Deno.core;
  try {
    Deno.core.print = 1;
  } catch {
    // pass
  }
  assert(print === Deno.core.print);
  try {
    delete Deno.core.print;
  } catch {
    // pass
  }
  assert(print === Deno.core.print);
});

unitTest(async function windowQueueMicrotask(): Promise<void> {
  let resolve1: () => void | undefined;
  let resolve2: () => void | undefined;
  let microtaskDone = false;
  const p1 = new Promise<void>((res): void => {
    resolve1 = (): void => {
      microtaskDone = true;
      res();
    };
  });
  const p2 = new Promise<void>((res): void => {
    resolve2 = (): void => {
      assert(microtaskDone);
      res();
    };
  });
  window.queueMicrotask(resolve1!);
  setTimeout(resolve2!, 0);
  await p1;
  await p2;
});
