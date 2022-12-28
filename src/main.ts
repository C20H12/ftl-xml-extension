/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols

import {commands, ExtensionContext, ExtensionMode, Terminal, Uri, window, workspace} from 'vscode';
import {
  AnimationNames, AnimationSheetNames,
  AugmentNames,
  ShipBlueprintNames,
  CrewNames,
  DroneNames,
  EventNamesValueSet, ImageListNames,
  ShipNames,
  SoundWaveNames,
  SystemNames,
  TextIdNames, WeaponAnimationNames,
  WeaponNames
} from './data/autocomplete-value-sets';
import {setup} from './setup';
import {addFtlDat} from './dat-fs-provider/add-ftl-dat';
import {AnimationPreview} from './animation-preview/animation-preview';


// noinspection JSUnusedGlobalSymbols
export function activate(context: ExtensionContext) {
  const {subs, workspaceParser, services} = setup(true);

  if (context.extensionMode !== ExtensionMode.Test) {
    services.output.appendLine('FTL Extension activated');
    subs.push(commands.registerCommand('ftl-xml.add-ftl-dat', async (_) => {
      await addFtlDat();
    }));
    commands.registerCommand('ftl-xml.parse-workspace', async () => {
      if (!workspaceParser.isParsing) {
        await workspaceParser.parseWorkspace();
      }
    });
    workspaceParser.parseWorkspace().then((root) => {
      // make sure that once parsing is done the animation preview context is updated
      const document = window.activeTextEditor?.document;
      AnimationPreview.updateMenuContext(root.xmlFiles.get(document?.uri.toString() ?? ''));

      const wantToUpdateDefaults = context.extensionMode == ExtensionMode.Development;
      if (wantToUpdateDefaults) {
        const eventNames = EventNamesValueSet.values.map((e) => e.name);
        const shipNames = ShipNames.values.map((v) => v.name);
        const textNames = TextIdNames.values.map((t) => t.name);
        const shipBlueprints = ShipBlueprintNames.values.map((b) => b.name);
        const weapons = WeaponNames.values.map((w) => w.name);
        const drones = DroneNames.values.map((d) => d.name);
        const augs = AugmentNames.values.map((a) => a.name);
        const crew = CrewNames.values.map((c) => c.name);
        const sys = SystemNames.values.map((s) => s.name);
        const sounds = SoundWaveNames.values.map((s) => s.name);
        const animations = AnimationNames.values.map((a) => a.name);
        const animationSheets = AnimationSheetNames.values.map((a) => a.name);
        const weaponAnimations = WeaponAnimationNames.values.map((a) => a.name);
        const imageLists = ImageListNames.values.map((a) => a.name);
        const imgFiles = root.imgFiles.map((i) => i.modPath);
        const soundFiles = root.soundWaveFiles.map((i) => i.modPath);
        const musicFiles = root.musicFiles.map((m) => m.modPath);
        const tmp = '';
      }
    });


    let terminal: Terminal | null = null;

    window.onDidCloseTerminal(t => {
      if (t.name === "patching output") {
        terminal = null;
      }
    })

    const locateSlipstreamPrompt = async () => {
      const slipstreamPathPickOptions = {
        canSelectFiles: false,
        canSelectFolders: true,
        title: "Find Slipstream (Folder containing modman.exe)"
      }
      const filePickRes = await window.showOpenDialog(slipstreamPathPickOptions);
      if (filePickRes === undefined) {
        window.showErrorMessage("file pick aborted");
        return;
      }
      return filePickRes[0].fsPath;
    }

    subs.push(commands.registerCommand('ftl-xml.patch-mod', async () => {
      const foldersOpen = workspace.workspaceFolders;

      if (foldersOpen === undefined) { 
        window.showErrorMessage("can't run, no folders open");
        return; 
      }
            
      if (terminal === null) {
        terminal = window.createTerminal("patching output", "powershell");
      }
      
      const extensionConfig = workspace.getConfiguration("ftl-xml");
      let pathToSlipstream = extensionConfig.get<string>("pathToSlipstream");
      if (pathToSlipstream === "" || pathToSlipstream === undefined) {
        window.showInformationMessage(
          "You will be prompted to locate slipstream as this is the first time this command is ran"
        );

        pathToSlipstream = await locateSlipstreamPrompt();
        extensionConfig.update("pathToSlipstream", pathToSlipstream, true);
      }
  
      const modPath = foldersOpen[0].uri.fsPath;
      const modName = foldersOpen[0].name;
      const patchWith = extensionConfig.get<string>("alwaysPatchWith");
      const shouldRunFTL = extensionConfig.get<boolean>("runFtl");

      terminal.show();
      terminal.sendText(
      `if ( $pathsToInclude -eq $null ) { 
        $pathsToInclude = New-Object System.Collections.Generic.List[System.String]
        if ( Test-Path -Path '${modPath}\\data' ) { $pathsToInclude.Add('${modPath}\\data') }
        if ( Test-Path -Path '${modPath}\\img' ) { $pathsToInclude.Add('${modPath}\\img') }
        if ( Test-Path -Path '${modPath}\\audio' ) { $pathsToInclude.Add('${modPath}\\audio') }
        if ( Test-Path -Path '${modPath}\\mod-appendix' ) { $pathsToInclude.Add('${modPath}\\mod-appendix') }
      }
      Compress-Archive \`
        -Path $pathsToInclude.ToArray() \`
        -DestinationPath '${pathToSlipstream}\\mods\\${modName}.zip' \`
        -Force
      &'${pathToSlipstream}\\modman.exe' --patch ${patchWith} ${modName}.zip ${shouldRunFTL ? "--runftl" : ""}`
      );
    }));

    subs.push(commands.registerCommand('ftl-xml.change-slipstream-path', async () => {
      workspace.getConfiguration("ftl-xml").update("pathToSlipstream", await locateSlipstreamPrompt(), true);
    }))

    subs.push(commands.registerCommand("ftl-xml.runFtlCommand", async () => {
      const pathToSlipstream = workspace.getConfiguration("ftl-xml").get<string>("pathToSlipstream");
      const modmanConfig = await workspace.fs.readFile(Uri.file(`${pathToSlipstream}\\modman.cfg`));
      const pathToFtl = modmanConfig.toString().split("ftl_dats_path=")[1].split('\n')[0].trim().replace("\\:", ":");
      if (terminal === null) {
        terminal = window.createTerminal("patching output", "powershell");
      }
      terminal.show();
      terminal.sendText(`Push-Location '${pathToFtl}' ; .\\FTLGame.exe ; Pop-Location`)
    }))
  }

  context.subscriptions.push(...subs);
}
