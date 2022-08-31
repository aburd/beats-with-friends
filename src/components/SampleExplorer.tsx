import {
  For,
  Show,
  createEffect,
  createSignal,
  createResource,
} from "solid-js";
import * as api from "../api";
import log from "loglevel";
import { Directory, Sample } from "../api/samples";
import "./SampleExplorer.css";

export type SampleExplorerProps = {
  onDirChange?: (dir?: Directory) => void;
  onSampleSelect?: (sample: Sample) => void;
};

/**
 * Convenience component for displaying errors in solid-js to the user
 */
export default function SampleExplorer(props: SampleExplorerProps) {
  const [dir, setDir] = createSignal<Directory | null>(null);
  const [curPath, setCurPath] = createSignal("");

  createEffect(() => {
    if (props.onDirChange && dir()) {
      props.onDirChange(dir() as Directory);
    }
  });

  createEffect(async () => {
    const d = await api.samples.list(curPath());
    setDir(d);
  });

  async function handleDirectorySelect(dir: Directory) {
    setCurPath(dir.path);
  }

  function handleSampleSelect(sample: Sample) {
    if (props.onSampleSelect) {
      props.onSampleSelect(sample);
    }
  }

  async function handleGoBack() {
    if (!curPath()) return;

    const pathParts = curPath().split("/");
    const prevPath = pathParts.slice(0, pathParts.length - 1).join("/");
    setCurPath(prevPath);
  }

  function DirectoryDisplay(props: { dir: Directory }) {
    const isActive = props.dir.path === curPath();
    return (
      <>
        <div
          class={`item-directory ${isActive ? "active" : ""}`}
          onClick={() => handleDirectorySelect(props.dir)}
        >
          {props.dir.name}
        </div>
        <div class="list-sub-directories">
          <For each={props.dir.directories}>
            {(directory) => <DirectoryDisplay dir={directory} />}
          </For>
        </div>
        <div class="list-samples">
          <For each={props.dir.samples}>
            {(sample) => (
              <div
                class="item-sample"
                onClick={() => handleSampleSelect(sample)}
              >
                {sample.name}
              </div>
            )}
          </For>
        </div>
      </>
    );
  }

  return (
    <div class="SampleExplorer">
      <Show when={curPath()}>
        <button onClick={() => handleGoBack()}>Back</button>
      </Show>
    <div class="container-directory-display">
      <Show when={dir()} fallback={"Loading..."}>
        <DirectoryDisplay dir={dir() as Directory} />
      </Show>
    </div>
    </div>
  );
}
