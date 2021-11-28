/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols

import {commands, ExtensionContext, ExtensionMode} from 'vscode';
import {
  AnimationNames, AnimationSheetNames,
  AugmentNames,
  AutoblueprintNames,
  CrewNames,
  DroneNames,
  EventNamesValueSet,
  ShipNames,
  SoundWaveNames,
  SystemNames,
  TextIdNames, WeaponAnimationNames,
  WeaponNames
} from './data/autocomplete-value-sets';
import {setup} from './setup';


// noinspection JSUnusedGlobalSymbols
export function activate(context: ExtensionContext) {
  const {subs, workspaceParser} = setup();
  context.subscriptions.push(...subs);

  if (context.extensionMode !== ExtensionMode.Test) {
    console.log('FTL Extension activated');
    commands.registerCommand('ftl-xml.parse-workspace', async () => {
      if (!workspaceParser.isParsing) {
        await workspaceParser.parseWorkspace();
      }
    });
    workspaceParser.parseWorkspace().then(() => {
      const wantToUpdateDefaults = context.extensionMode == ExtensionMode.Development;
      if (wantToUpdateDefaults) {
        const eventNames = EventNamesValueSet.values.map((e) => e.name);
        const shipNames = ShipNames.values.map((v) => v.name);
        const textNames = TextIdNames.values.map((t) => t.name);
        const autoBlueprints = AutoblueprintNames.values.map((b) => b.name);
        const weapons = WeaponNames.values.map((w) => w.name);
        const drones = DroneNames.values.map((d) => d.name);
        const augs = AugmentNames.values.map((a) => a.name);
        const crew = CrewNames.values.map((c) => c.name);
        const sys = SystemNames.values.map((s) => s.name);
        const sounds = SoundWaveNames.values.map((s) => s.name);
        const animations = AnimationNames.values.map((a) => a.name);
        const animationSheets = AnimationSheetNames.values.map((a) => a.name);
        const weaponAnimations = WeaponAnimationNames.values.map((a) => a.name);
        const tmp = '';
      }
    });
  }
}
