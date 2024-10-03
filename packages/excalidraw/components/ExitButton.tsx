import clsx from "clsx";
import { useEffect, useState, useMemo, useRef } from "react";
import { ContinueDrawingIcon, PauseDrawingIcon } from "./icons";
import { ToolButton } from "./ToolButton";
import { capitalizeString } from "../utils";
import { appWindow } from "@tauri-apps/api/window";
import { type UnlistenFn } from "@tauri-apps/api/helpers/event";

const ICONS = {
  CHECKED: ContinueDrawingIcon,
  UNCHECKED: PauseDrawingIcon,
};

/**
 * Hook to run an async effect on mount and another on unmount.
 */
export const useAsyncEffect = (
  mountCallback: () => Promise<any>,
  unmountCallback: () => Promise<any>,
  deps: any[] = [],
): UseAsyncEffectResult => {
  const isMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const [result, setResult] = useState<any>();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    let mountSucceeded = false;

    (async () => {
      await Promise.resolve(); // wait for the initial cleanup in Strict mode - avoids double mutation
      if (!isMounted.current || ignore) {
        return;
      }
      setIsLoading(true);
      try {
        const result = await mountCallback();
        mountSucceeded = true;
        if (isMounted.current && !ignore) {
          setError(undefined);
          setResult(result);
          setIsLoading(false);
        } else {
          // Component was unmounted before the mount callback returned, cancel it
          unmountCallback();
        }
      } catch (error) {
        if (!isMounted.current) return;
        setError(error);
        setIsLoading(false);
      }
    })();

    return () => {
      ignore = true;
      if (mountSucceeded) {
        unmountCallback()
          .then(() => {
            if (!isMounted.current) return;
            setResult(undefined);
          })
          .catch((error: unknown) => {
            if (!isMounted.current) return;
            setError(error);
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return useMemo(
    () => ({ result, error, isLoading }),
    [result, error, isLoading],
  );
};

export interface UseAsyncEffectResult {
  result: any;
  error: any;
  isLoading: boolean;
}

function useTauriAppFocusState() {
  const [focused, setFocused] = useState(true);
  const [block, setBlock] = useState(false);
  const unSubFn = useRef<UnlistenFn | undefined>();

  useEffect(() => {
    appWindow
      .listen("tauri://focus  ", (event) => {
        setFocused(true);
      })
      .then((fn) => (unSubFn.current = fn));

    return () => {
      unSubFn.current?.();
    };
  }, []);

  return focused;
}

export function ExitDrawButton() {
  const isWindowApp = "__TAURI__" in window;
  return isWindowApp ? (
    <ToolButton
      className={clsx("Shape", { fillable: false })}
      key={"exit"}
      type="button"
      icon={ICONS.UNCHECKED}
      // checked={activeTool.type === value}
      name="editor-current-shape"
      title={`${capitalizeString("Exit drawing")} — ${undefined}`}
      // keyBindingLabel={"x"}
      aria-label={capitalizeString("exit")}
      onClick={() => {
        setTimeout(() => {
          appWindow.setIgnoreCursorEvents(true);
        }, 100);
      }}
      // aria-keyshortcuts={shortcut}
      // data-testid={`toolbar-${value}`}
      // onPointerDown={({ pointerType }) => {
      //   if (!appState.penDetected && pointerType === "pen") {
      //     app.togglePenMode(true);
      //   }
      // }}
      // onChange={({ pointerType }) => {
      //   if (appState.activeTool.type !== value) {
      //     trackEvent("toolbar", value, "ui");
      //   }
      //   if (value === "image") {
      //     app.setActiveTool({
      //       type: value,
      //       insertOnCanvasDirectly: pointerType !== "mouse",
      //     });
      //   } else {
      //     app.setActiveTool({ type: value });
      //   }
      // }}
    />
  ) : null;
}
