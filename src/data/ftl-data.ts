import {HTMLDataV1, IAttributeData, ITagData} from 'vscode-html-languageservice';
import {
  AnimationNames,
  AnimationSheetNames,
  AugmentNames,
  AutoblueprintNames,
  CrewNames,
  DroneNames,
  EventNamesValueSet,
  MusicPaths,
  ShipNames,
  SoundNames,
  SoundPaths,
  SystemNames,
  TextIdNames,
  WeaponAnimationNames,
  WeaponNames
} from './autocomplete-value-sets';

export interface XmlTag extends ITagData {
  tags?: string[] | undefined;
  requiredTags?: string[];
  contentsValueSet?: string;
  requiredTagsByParent?: { [key: string]: string[] };
}

type XmlData = HTMLDataV1 & { tags: XmlTag[] };

function boolAttr(name: string): IAttributeData {
  return {name: name, valueSet: 'bool'};
}

const hyperspaceEventChildren: XmlTag[] = [
  {name: 'beaconType', attributes: []},
  {name: 'recallBoarders', attributes: []},
  {name: 'instantEscape', attributes: []},
  {name: 'customFleet', attributes: []},
  {name: 'unlockCustomShip', attributes: []},
  {name: 'preventQuest', attributes: []},
  {name: 'preventFleet', attributes: []},
  {name: 'remove', attributes: [{name: 'name'}]},
  {name: 'jumpEvent', attributes: [], contentsValueSet: EventNamesValueSet.name}
];
const eventChildTags: XmlTag[] = [
  // ...allow XML tags of these types to be nested inside:
  {name: 'environment', attributes: []},
  {name: 'fleet', attributes: []},
  {name: 'distressBeacon', attributes: []},
  {name: 'repair', attributes: []},
  {
    name: 'autoReward',
    attributes: [
      {
        name: 'level',
        values: [{name: 'LOW'}, {name: 'MED'}, {name: 'HIGH'}]
      }
    ],
    contentsValueSet: 'auto-reward-set'
  },
  {
    name: 'boarders',
    attributes: [{name: 'class'}, {name: 'min'}, {name: 'max'}]
  },
  {name: 'reveal_map', attributes: []},
  {name: 'modifyPursuit', attributes: []},
  {name: 'quest', attributes: [{name: 'event', valueSet: EventNamesValueSet.name}]},
  {name: 'unlockShip', attributes: []},
  {name: 'item_modify', attributes: [], tags: ['item']},
  {name: 'secretSector', attributes: []},
  {name: 'upgrade', attributes: [{name: 'system', valueSet: SystemNames.name}]},
  ...hyperspaceEventChildren
];
const eventChildTagNames = eventChildTags.map((t) => t.name);
eventChildTagNames.push('choice',
    'text',
    'crewMember',
    'ship',
    'event',
    'weapon',
    'damage',
    'img',
    'removeCrew',
    'status',
    'drone',
    'augment',
    'store');

const shipTags: XmlTag[] = [
  {name: 'weaponOverride', attributes: [], tags: ['name']},
  {
    name: 'destroyed',
    tags: eventChildTagNames,
    attributes: [{name: 'load', valueSet: EventNamesValueSet.name}]
  },
  {
    name: 'deadCrew',
    tags: eventChildTagNames,
    attributes: [{name: 'load', valueSet: EventNamesValueSet.name}]
  },
  {
    name: 'surrender',
    tags: eventChildTagNames,
    attributes: [{name: 'load', valueSet: EventNamesValueSet.name}]
  },
  {
    name: 'escape',
    tags: eventChildTagNames,
    attributes: [{name: 'load', valueSet: EventNamesValueSet.name}]
  },
  {
    name: 'gotaway',
    tags: eventChildTagNames,
    attributes: [{name: 'load', valueSet: EventNamesValueSet.name}]
  },
  {name: 'crew', attributes: [], tags: ['crewMember']},
];
const shipTagNames = [...shipTags.map((t) => t.name), 'crewMember'];

const weaponTags: XmlTag[] = [
  {name: 'type', attributes: []},
  {name: 'short', attributes: [{name: 'id', valueSet: TextIdNames.name}]},
  {name: 'locked', attributes: []},
  {name: 'desc', attributes: [{name: 'id', valueSet: TextIdNames.name}]},
  {name: 'tooltip', attributes: [{name: 'id', valueSet: TextIdNames.name}]},
  {name: 'ion', attributes: []},
  {name: 'sysDamage', attributes: []},
  {name: 'persDamage', attributes: []},
  {name: 'speed', attributes: []},
  {name: 'missiles', attributes: []},
  {name: 'shots', attributes: []},
  {name: 'length', attributes: []},
  {name: 'lockdown', attributes: []},
  {name: 'sp', attributes: []},
  {name: 'fireChance', attributes: []},
  {name: 'breachChance', attributes: []},
  {name: 'stunChance', attributes: []},
  {name: 'hullBust', attributes: []},
  {name: 'cooldown', attributes: []},
  {name: 'power', attributes: []},
  {name: 'cost', attributes: []},
  {name: 'bp', attributes: []},
  {name: 'rarity', attributes: [], contentsValueSet: 'rarity-value-set'},
  {name: 'image', attributes: [], contentsValueSet: AnimationNames.name},
  {name: 'explosion', attributes: [], contentsValueSet: AnimationNames.name},
  {name: 'launchSounds', attributes: []},
  {name: 'hitShipSounds', attributes: []},
  {name: 'hitShieldSounds', attributes: []},
  {name: 'missSounds', attributes: []},
  {name: 'weaponArt', attributes: [], contentsValueSet: WeaponAnimationNames.name},
  {name: 'tip', attributes: [], contentsValueSet: TextIdNames.name},
  {name: 'iconImage', attributes: []},
  {name: 'color', attributes: []},
  {name: 'drone_targetable', attributes: []},
  {name: 'flavorType', attributes: [{name: 'id', valueSet: TextIdNames.name}]},
  {name: 'radius', attributes: []},
  {name: 'spin', attributes: []},
  {name: 'projectiles', attributes: []},
  {name: 'chargeLevels', attributes: []},
  {name: 'boost', attributes: []},
  {name: 'stun', attributes: []},
];
const weaponTagNames = [...weaponTags.map((t) => t.name), 'title'];

const sectorDescriptionTags: XmlTag[] = [
  {name: 'startEvent', attributes: [], contentsValueSet: EventNamesValueSet.name},
  {name: 'rarityList', attributes: []},
  {name: 'trackList', attributes: []},
  {name: 'nameList', attributes: []},
];

export const BlueprintListTypeAny = 'any';
export const FtlData: XmlData = {
  version: 1.1,
  tags: [
    {
      name: 'event',
      tags: eventChildTagNames,
      attributes: [
        {name: 'name'},
        boolAttr('hidden'),
        boolAttr('unique'),
        {name: 'load', valueSet: EventNamesValueSet.name}
      ],
    },
    {
      name: 'choice',
      description: 'encloses the choice text and event for each choice in an event',
      tags: eventChildTagNames,
      requiredTags: ['text'],
      attributes: [
        boolAttr('unique'),
        {
          name: 'hidden',
          valueSet: 'bool',
          description: ` if marked true, the choice's rewards will not be displayed before selecting the event. By default set to false. (usually set to true unless its an event where a trade is made, so that you can see the exact values of what is being traded)`
        },
        {name: 'req'},
        {name: 'lvl'},
        boolAttr('blue'),
        {name: 'max_group'},
        {name: 'max_lvl'}
      ]
    },
    // event tags
    ...eventChildTags,

    // ship tags
    {
      name: 'ship',
      tags: shipTagNames,
      attributes: [
        {
          name: 'load',
          valueSet: ShipNames.name
        },
        {
          name: 'auto_blueprint',
          valueSet: AutoblueprintNames.name
        },
        {name: 'name'},
        boolAttr('hostile')
      ]
    },
    ...shipTags,
    {
      name: 'blueprintList',
      tags: ['name'],
      attributes: [
        {name: 'name'},
        {name: 'type', values: [{name: BlueprintListTypeAny}]}
      ]
    },
    {
      name: 'shipBlueprint',
      attributes: [
        {name: 'name'}
      ]
    },
    {name: 'bossShip', attributes: [], contentsValueSet: AutoblueprintNames.name},
    {
      name: 'crewBlueprint',
      attributes: [
        {name: 'name'}
      ],
      tags: [
        'desc', 'cost', 'title', 'short', 'rarity', 'powerList', 'bp', 'colorList'
      ]
    },
    {
      name: 'systemBlueprint',
      attributes: [
        {name: 'name'}
      ],
      tags: [
        'type', 'title', 'desc', 'startPower', 'maxPower', 'rarity', 'upgradeCost',
        'cost', 'locked', 'bp'
      ]
    },
    {
      name: 'text',
      attributes: [
        {name: 'name'},
        {name: 'id', valueSet: TextIdNames.name},
        {name: 'load', valueSet: TextIdNames.name}
      ]
    },
    {
      name: 'textList',
      attributes: [{name: 'name'}],
      tags: ['text']
    },
    {
      name: 'title',
      attributes: [{name: 'id', valueSet: TextIdNames.name}],
    },
    {
      name: 'weapon',
      attributes: [{name: 'name', valueSet: WeaponNames.name}]
    },
    {
      name: 'weaponBlueprint',
      tags: weaponTagNames,
      requiredTags: [
        'type', 'title', 'short', 'desc', 'tooltip', 'cooldown',
        'power', 'cost', 'rarity', 'weaponArt', 'launchSounds',
      ],
      requiredTagsByParent: {'droneBlueprint': []},
      attributes: [{name: 'name'}]
    },
    ...weaponTags,
    {name: 'projectile', attributes: [{name: 'count'}, boolAttr('fake')], contentsValueSet: AnimationNames.name},
    {
      name: 'droneBlueprint',
      attributes: [{name: 'name'}],
      tags: ['weaponBlueprint']
    },
    {name: 'augmentBlueprint', attributes: [{name: 'name'}]},
    {
      name: 'sectorDescription',
      attributes: [
        {name: 'name'},
        {name: 'minSector'},
        boolAttr('unique'),
      ],
      tags: sectorDescriptionTags.map((t) => t.name)
    },
    ...sectorDescriptionTags,
    {
      name: 'damage',
      attributes: [{name: 'amount'}, {name: 'system', valueSet: SystemNames.name}, {name: 'effect'}]
    },
    {
      name: 'crewMember',
      attributes: [
        {name: 'amount'},
        {
          name: 'class',
          valueSet: CrewNames.name
        },
        {
          name: 'type',
          valueSet: CrewNames.name
        }]
    },
    {name: 'img', attributes: []},
    {
      name: 'removeCrew',
      attributes: [{
        name: 'class',
        valueSet: CrewNames.name
      }],
      tags: [...eventChildTagNames, 'clone']
    },
    {name: 'status', attributes: [{name: 'system', valueSet: SystemNames.name}]},
    {name: 'restartEvent', attributes: []},
    {
      name: 'drone',
      attributes: [{name: 'name', valueSet: DroneNames.name}]
    },
    {name: 'loadEvent', attributes: [], contentsValueSet: EventNamesValueSet.name},
    {
      name: 'augment',
      attributes: [{name: 'name', valueSet: AugmentNames.name}]
    },
    {
      name: 'exitBeacon',
      attributes: [
        {name: 'event', valueSet: EventNamesValueSet.name},
        {name: 'nebulaEvent', valueSet: EventNamesValueSet.name},
        {name: 'rebelEvent', valueSet: EventNamesValueSet.name}
      ]
    },
    {
      name: 'rebelBeacon',
      attributes: [
        {name: 'event', valueSet: EventNamesValueSet.name},
        {name: 'nebulaEvent', valueSet: EventNamesValueSet.name}
      ]
    },
    {name: 'store', attributes: []},
    {name: 'triggeredEvent', attributes: [{name: 'event', valueSet: EventNamesValueSet.name}]},
    {name: 'hiddenAug', attributes: []},

    {name: 'aggressive', attributes: []},
    {name: 'removeHazards', attributes: []},
    {name: 'secretSectorWarp', attributes: []},
    {name: 'checkCargo', attributes: []},
    {name: 'transformRace', attributes: []},
    {name: 'changeBackground', attributes: []},
    {name: 'playSound', attributes: []},
    {name: 'sound', attributes: [], contentsValueSet: SoundNames.name},
    {name: 'jumpEvent', attributes: []},
    {name: 'clearTriggeredEvent', attributes: []},
    {name: 'enemyDamage', attributes: []},
    {name: 'lose', attributes: []},
    {name: 'system', attributes: []},
    {name: 'noQuestText', attributes: []},
    {name: 'replaceSector', attributes: []},
    {name: 'superBarrage', attributes: []},
    {name: 'superDrones', attributes: []},
    {name: 'clearSuperDrones', attributes: []},
    {name: 'removeItem', attributes: []},
    {name: 'loadEventList', attributes: []},
    {name: 'superShields', attributes: []},
    {name: 'runFromFleet', attributes: []},
    {name: 'preventBossFleet', attributes: []},
    {name: 'resetFtl', attributes: []},
    {name: 'win', attributes: []},
    {name: 'disableScrapScore', attributes: []},
    {name: 'eventList', attributes: [], tags: ['event']},
    // quest child tags
    {name: 'nebulaEvent', attributes: [], contentsValueSet: EventNamesValueSet.name},

    {name: 'explore', attributes: [], contentsValueSet: MusicPaths.name},
    {name: 'combat', attributes: [], contentsValueSet: MusicPaths.name},

    {name: 'anim', attributes: [{name: 'name'}]},
    {name: 'weaponAnim', attributes: [{name: 'name'}]},
    {name: 'sheet', attributes: [], contentsValueSet: AnimationSheetNames.name},
    {name: 'animSheet', attributes: [{name: 'name'}]},
  ],
  valueSets: [
    {name: 'bool', values: [{name: 'true'}, {name: 'false'}]},
    {
      name: 'rarity-value-set',
      values: [
        {name: '1', description: 'most frequent'},
        {name: '2'},
        {name: '3'},
        {name: '4'},
        {name: '5', description: 'least frequent'},
        {name: '0', description: 'never shows up'},
      ]
    },
    {
      name: 'auto-reward-set', values: [
        {name: 'stuff'},
        {name: 'standard'},
        {name: 'scrap_only'},
        {name: 'weapon'},
        {name: 'droneparts'},
        {name: 'missiles'},
      ]
    },
    EventNamesValueSet,
    ShipNames,
    AutoblueprintNames,
    TextIdNames,
    WeaponNames,
    DroneNames,
    AugmentNames,
    CrewNames,
    SystemNames,
    SoundNames,
    SoundPaths,
    MusicPaths,
    AnimationNames,
    AnimationSheetNames,
    WeaponAnimationNames,
  ]
};
