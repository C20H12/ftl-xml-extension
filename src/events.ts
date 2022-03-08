import {Node} from 'vscode-html-languageservice';
import {Position, TextDocument} from 'vscode';
import {getAttrValueForTag, getNodeTextContent, hasAttr, normalizeAttributeName} from './helpers';
import {NodeMap} from './ref-mappers/node-map';

class EventsMap implements NodeMap {
  getNameDef(node: Node, document: TextDocument, position?: Position): string | undefined {
    if ((node.tag != 'eventList' && node.tag != 'event')
        || node.parent?.tag == 'sectorDescription'
        || node.parent?.tag == 'loadEventList') {
      return undefined;
    }

    if (hasAttr(node, 'name', document, position)) {
      return normalizeAttributeName(node.attributes.name);
    }
  }

  getRefName(node: Node, document: TextDocument, position: Position): string | undefined;
  getRefName(node: Node, document: TextDocument): string | string[] | undefined;
  getRefName(node: Node, document: TextDocument, position?: Position): string | string[] | undefined {
    if (node.tag == 'event' && hasAttr(node, 'load', document, position)) {
      return normalizeAttributeName(node.attributes.load);
    }

    if (node.tag == 'exitBeacon') {
      const refs: string[] = [];
      if (hasAttr(node, 'event', document, position)) {
        refs.push(normalizeAttributeName(node.attributes.event));
      }
      if (hasAttr(node, 'nebulaEvent', document, position)) {
        refs.push(normalizeAttributeName(node.attributes.nebulaEvent));
      }
      if (hasAttr(node, 'rebelEvent', document, position)) {
        refs.push(normalizeAttributeName(node.attributes.rebelEvent));
      }
      if (position) return refs[0];
      return refs;
    }

    if (node.tag == 'rebelBeacon') {
      const refs: string[] = [];
      if (hasAttr(node, 'event', document, position)) {
        refs.push(normalizeAttributeName(node.attributes.event));
      }
      if (hasAttr(node, 'nebulaEvent', document, position)) {
        refs.push(normalizeAttributeName(node.attributes.nebulaEvent));
      }
      if (position) return refs[0];
      return refs;
    }
    if (node.tag == 'eventAlias') {
      const refs: string[] = [];
      if (hasAttr(node, 'name', document, position)) {
        refs.push(normalizeAttributeName(node.attributes.name));
      }
      const contents = getNodeTextContent(node, document, 'eventAlias');
      if (contents) refs.push(contents);
      if (position) return refs[0];
      return refs;
    }

    if (node.tag == 'event' && (node.parent?.tag == 'sectorDescription' || node.parent?.tag == 'loadEventList')
        && hasAttr(node, 'name', document, position)) {
      return normalizeAttributeName(node.attributes.name);
    }
    return getNodeTextContent(node, document, 'startEvent')
        ?? getNodeTextContent(node, document, 'loadEvent')
        ?? getNodeTextContent(node, document, 'nebulaEvent')
        ?? getNodeTextContent(node, document, 'jumpEvent')
        ?? getNodeTextContent(node, document, 'deathEvent')
        ?? getNodeTextContent(node, document, 'revisitEvent')
        ?? getNodeTextContent(node, document, 'queueEvent')
        ?? getNodeTextContent(node, document, 'renameBeacon')
        ?? getAttrValueForTag(node, 'triggeredEvent', 'event', document, position)
        ?? getAttrValueForTag(node, 'loadEventList', 'default', document, position)
        ?? getAttrValueForTag(node, 'destroyed', 'load', document, position)
        ?? getAttrValueForTag(node, 'deadCrew', 'load', document, position)
        ?? getAttrValueForTag(node, 'surrender', 'load', document, position)
        ?? getAttrValueForTag(node, 'escape', 'load', document, position)
        ?? getAttrValueForTag(node, 'gotaway', 'load', document, position)
        ?? getAttrValueForTag(node, 'quest', 'event', document, position);
  }
}


export const events = new EventsMap();
