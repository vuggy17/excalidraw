import clsx from "clsx";
import { PencilXIcon } from "./icons";
import { ToolButton } from "./ToolButton";
import { capitalizeString } from "../utils";

export function ExitDrawButton() {
  const isWindowApp = "__TAURI__" in window;

  console.log("isWindowApp", isWindowApp, window);
  return isWindowApp ? (
    <ToolButton
      className={clsx("Shape", { fillable: false })}
      key={"exit"}
      type="button"
      icon={PencilXIcon}
      // checked={activeTool.type === value}
      name="editor-current-shape"
      title={`${capitalizeString("Exit drawing")} — ${undefined}`}
      // keyBindingLabel={"x"}
      aria-label={capitalizeString("exit")}
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
