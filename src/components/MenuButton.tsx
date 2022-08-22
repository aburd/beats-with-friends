import * as util from "../util";

export default function MenuButton() {
  return (
    <div class="App-btn-menu">
      <button onClick={() => util.setNavExpanded(true)}>Menu</button>
    </div>
  )
}
