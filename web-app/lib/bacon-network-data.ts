// Kevin Bacon to Francis Bacon Network Data for Interactive Visualization
// This data represents the full network of actors, films, and connections

import { GraphNode, GraphLink } from './types';

// Featured path highlighting - elegant cross-media journey through the Bacons
// Kevin Bacon (actor) → Love Is the Devil → Francis Bacon (painter) → Francis Bacon (statesman)
const FEATURED_PATH_IDS = [
  'actor-kevin-bacon',
  'media-love-is-the-devil',
  'figure-francis-bacon-painter',
  'media-bacon-namesake',
  'figure-francis-bacon-statesman',
];

export function getBaconNetworkData(): { nodes: GraphNode[]; links: GraphLink[] } {
  // Actors
  const kevinBacon: GraphNode = {
    id: 'actor-kevin-bacon',
    name: 'Kevin Bacon',
    type: 'figure',
    sentiment: 'Complex',
  };

  const jackLemmon: GraphNode = {
    id: 'actor-jack-lemmon',
    name: 'Jack Lemmon',
    type: 'figure',
    sentiment: 'Complex',
  };

  const derekJacobi: GraphNode = {
    id: 'actor-derek-jacobi',
    name: 'Derek Jacobi',
    type: 'figure',
    sentiment: 'Complex',
  };

  const danielCraig: GraphNode = {
    id: 'actor-daniel-craig',
    name: 'Daniel Craig',
    type: 'figure',
    sentiment: 'Complex',
  };

  const tildaSwinton: GraphNode = {
    id: 'actor-tilda-swinton',
    name: 'Tilda Swinton',
    type: 'figure',
    sentiment: 'Complex',
  };

  const tomHanks: GraphNode = {
    id: 'actor-tom-hanks',
    name: 'Tom Hanks',
    type: 'figure',
    sentiment: 'Complex',
  };

  const jackNicholson: GraphNode = {
    id: 'actor-jack-nicholson',
    name: 'Jack Nicholson',
    type: 'figure',
    sentiment: 'Complex',
  };

  // Media Works
  const jfk: GraphNode = {
    id: 'media-jfk',
    name: 'JFK (1991)',
    type: 'media',
    sentiment: 'Complex',
  };

  const hamlet: GraphNode = {
    id: 'media-hamlet',
    name: 'Hamlet (1996)',
    type: 'media',
    sentiment: 'Complex',
  };

  const loveIsTheDevil: GraphNode = {
    id: 'media-love-is-the-devil',
    name: 'Love Is the Devil (1998)',
    type: 'media',
    sentiment: 'Complex',
  };

  const apollo13: GraphNode = {
    id: 'media-apollo-13',
    name: 'Apollo 13 (1995)',
    type: 'media',
    sentiment: 'Complex',
  };

  const mysticRiver: GraphNode = {
    id: 'media-mystic-river',
    name: 'Mystic River (2003)',
    type: 'media',
    sentiment: 'Complex',
  };

  const aFewGoodMen: GraphNode = {
    id: 'media-a-few-good-men',
    name: 'A Few Good Men (1992)',
    type: 'media',
    sentiment: 'Complex',
  };

  const iClaudius: GraphNode = {
    id: 'media-i-claudius',
    name: 'I, Claudius (1976)',
    type: 'media',
    sentiment: 'Complex',
  };

  const cadfael: GraphNode = {
    id: 'media-cadfael',
    name: 'Cadfael (1995-1999)',
    type: 'media',
    sentiment: 'Complex',
  };

  const baconBiography: GraphNode = {
    id: 'media-bacon-biography',
    name: 'Francis Bacon: Anatomy of an Enigma (Book, 1996)',
    type: 'media',
    sentiment: 'Complex',
  };

  const screamingPope: GraphNode = {
    id: 'media-screaming-pope',
    name: 'The Screaming Pope (Painting, 1953)',
    type: 'media',
    sentiment: 'Complex',
  };

  const baconNamesake: GraphNode = {
    id: 'media-bacon-namesake',
    name: 'The Two Francis Bacons (Essay)',
    type: 'media',
    sentiment: 'Complex',
  };

  // Historical Figures
  const popeInnocentX: GraphNode = {
    id: 'figure-pope-innocent-x',
    name: 'Pope Innocent X (1574-1655)',
    type: 'figure',
    sentiment: 'Complex',
  };

  const francisBaconPainter: GraphNode = {
    id: 'figure-francis-bacon-painter',
    name: 'Francis Bacon (Painter, 1909-1992)',
    type: 'figure',
    sentiment: 'Complex',
  };

  const francisBaconStatesman: GraphNode = {
    id: 'figure-francis-bacon-statesman',
    name: 'Francis Bacon (Statesman, 1561-1626)',
    type: 'figure',
    sentiment: 'Complex',
  };

  // All nodes
  const nodes: GraphNode[] = [
    // Featured path actors and figures
    kevinBacon,
    francisBaconPainter,
    francisBaconStatesman,
    // Other actors
    jackLemmon,
    derekJacobi,
    danielCraig,
    tildaSwinton,
    tomHanks,
    jackNicholson,
    // Historical figures
    popeInnocentX,
    // Media in featured path
    loveIsTheDevil,
    baconNamesake,
    // Other media
    jfk,
    hamlet,
    baconBiography,
    screamingPope,
    apollo13,
    mysticRiver,
    aFewGoodMen,
    iClaudius,
    cadfael,
  ];

  // Links - featured path: Kevin Bacon → Francis Bacon (painter) → Francis Bacon (statesman)
  const featuredLinks: GraphLink[] = [
    // Kevin Bacon → Love Is the Devil (film about Francis Bacon the painter)
    {
      source: 'actor-kevin-bacon',
      target: 'media-love-is-the-devil',
      sentiment: 'Complex',
    },
    // Love Is the Devil → Francis Bacon (painter) - the subject of the film
    {
      source: 'media-love-is-the-devil',
      target: 'figure-francis-bacon-painter',
      sentiment: 'Complex',
    },
    // Francis Bacon (painter) → Essay connecting the two Francis Bacons
    {
      source: 'figure-francis-bacon-painter',
      target: 'media-bacon-namesake',
      sentiment: 'Complex',
    },
    // Essay → Francis Bacon (statesman) - the historical namesake
    {
      source: 'media-bacon-namesake',
      target: 'figure-francis-bacon-statesman',
      sentiment: 'Complex',
    },
  ];

  // Links - additional connections
  const otherLinks: GraphLink[] = [
    // Kevin Bacon in other films
    {
      source: 'actor-kevin-bacon',
      target: 'media-jfk',
      sentiment: 'Complex',
    },
    {
      source: 'media-jfk',
      target: 'actor-jack-lemmon',
      sentiment: 'Complex',
    },
    {
      source: 'actor-jack-lemmon',
      target: 'media-hamlet',
      sentiment: 'Complex',
    },
    {
      source: 'media-hamlet',
      target: 'actor-derek-jacobi',
      sentiment: 'Complex',
    },
    {
      source: 'actor-derek-jacobi',
      target: 'media-love-is-the-devil',
      sentiment: 'Complex',
    },
    {
      source: 'actor-kevin-bacon',
      target: 'media-apollo-13',
      sentiment: 'Complex',
    },
    {
      source: 'media-apollo-13',
      target: 'actor-tom-hanks',
      sentiment: 'Complex',
    },
    {
      source: 'actor-kevin-bacon',
      target: 'media-mystic-river',
      sentiment: 'Complex',
    },
    {
      source: 'actor-kevin-bacon',
      target: 'media-a-few-good-men',
      sentiment: 'Complex',
    },
    {
      source: 'media-a-few-good-men',
      target: 'actor-jack-nicholson',
      sentiment: 'Complex',
    },
    // Derek Jacobi in other media
    {
      source: 'actor-derek-jacobi',
      target: 'media-i-claudius',
      sentiment: 'Complex',
    },
    {
      source: 'actor-derek-jacobi',
      target: 'media-cadfael',
      sentiment: 'Complex',
    },
    // Love Is the Devil co-stars
    {
      source: 'media-love-is-the-devil',
      target: 'actor-daniel-craig',
      sentiment: 'Complex',
    },
    {
      source: 'media-love-is-the-devil',
      target: 'actor-tilda-swinton',
      sentiment: 'Complex',
    },
    // Francis Bacon (painter) connections
    {
      source: 'figure-francis-bacon-painter',
      target: 'media-screaming-pope',
      sentiment: 'Complex',
    },
    {
      source: 'media-screaming-pope',
      target: 'figure-pope-innocent-x',
      sentiment: 'Complex',
    },
    {
      source: 'figure-francis-bacon-painter',
      target: 'media-bacon-biography',
      sentiment: 'Complex',
    },
  ];

  const links = [...featuredLinks, ...otherLinks];

  return {
    nodes,
    links: links.map(link => ({
      ...link,
      // Mark featured path links for highlighting
      featured: FEATURED_PATH_IDS.includes(link.source) && FEATURED_PATH_IDS.includes(link.target),
    })),
  };
}

export function isFeaturedPathNode(nodeId: string): boolean {
  return FEATURED_PATH_IDS.includes(nodeId);
}

export function isFeaturedPathLink(source: string, target: string): boolean {
  return FEATURED_PATH_IDS.includes(source) && FEATURED_PATH_IDS.includes(target);
}
