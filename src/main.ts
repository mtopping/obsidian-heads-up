import {
  App,
  Editor,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
import behead from 'remark-behead';
import {remark} from 'remark';

interface ObsidianLevelUpSettings {
  mySetting: string;
}
const DEFAULT_SETTINGS: ObsidianLevelUpSettings = {
  mySetting: "default",
};
export default class ObsidianLevelUp extends Plugin {
  settings: ObsidianLevelUpSettings;
  async onload() {
    console.log("loading plugin");
    await this.loadSettings();
    this.addRibbonIcon("dice", "Sample Plugin", () => {
      new Notice("This is a notice!");
    });
    this.addStatusBarItem().setText("Status Bar Text");
   
    this.addCommand({
      id: "remarkable-heading-level-up",
      name: "Remarkable: Scale up headings from selection",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const selection = editor.getSelection()
        remark()
          .use(behead, {depth: -1})
          .process(selection)
          .then((vfile) => vfile.toString())
          .then((markdown) => {
            
            editor.replaceSelection(markdown);
            console.log(markdown);
          })
          .catch((err) => console.error(err));
      },
    });
    this.addCommand({
      id: "remarkable-heading-level-down",
      name: "Remarkable: Scale down headings from selection",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const selection = editor.getSelection()
        remark()
          .use(behead, {depth: 1})
          .process(selection)
          .then((vfile) => vfile.toString())
          .then((markdown) => {
            
            editor.replaceSelection(markdown);
            console.log(markdown);
          })
          .catch((err) => console.error(err));
      },
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      console.log("codemirror", cm);
    });
    this.registerDomEvent(document, "click", (evt: MouseEvent) => {
      console.log("click", evt);
    });
    this.registerInterval(
      window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
    );
  }
  onunload() {
    console.log("unloading plugin");
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
}
class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }
  onOpen() {
    let { contentEl } = this;
    contentEl.setText("Woah!");
  }
  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}
class SampleSettingTab extends PluginSettingTab {
  plugin: ObsidianLevelUp;
  constructor(app: App, plugin: ObsidianLevelUp) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display(): void {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });
    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange(async (value) => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
