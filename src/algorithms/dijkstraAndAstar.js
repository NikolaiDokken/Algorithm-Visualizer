// algorithm for Dijkstra and A*
// Takes a boolean aStar and uses distace to finish
// if aStar is true
export function dijkstra(grid, startNode, finishNode, aStar) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes, finishNode, aStar);
    const closestNode = unvisitedNodes.shift();
    // If node is wall, we skip it
    if (closestNode.isWall) continue;
    // If closestNode has a distance of infinity,
    // we must be trapped, and have to stop
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeigbours(closestNode, grid);
  }
}

// Extracts all nodes from a grid
function getAllNodes(grid) {
  const nodes = [];
  for (let rows = 0; rows < grid.length; rows++) {
    for (let cols = 0; cols < grid[rows].length; cols++) {
      nodes.push(grid[rows][cols]);
    }
  }
  return nodes;
}

// Sorts unvisited nodes so that
// first node in array is closest to startNode
// or closest to startNode and finishNode if
// we are using A* algorithm
function sortNodesByDistance(unvisitedNodes, finishNode, aStar) {
  unvisitedNodes.sort(
    (n1, n2) =>
      n1.distance +
      (aStar ? estimatedDistanceToFinish(n1, finishNode) : 0) -
      (n2.distance + (aStar ? estimatedDistanceToFinish(n2, finishNode) : 0))
  );
}

function estimatedDistanceToFinish(startNode, finishNode) {
  const startRow = startNode.row;
  const startCol = startNode.col;
  const finishRow = finishNode.row;
  const finishCol = finishNode.col;
  return Math.sqrt(
    Math.pow(finishRow - startRow, 2) + Math.pow(finishCol - startCol, 2)
  );
}

function updateUnvisitedNeigbours(node, grid) {
  const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of unvisitedNeighbours) {
    neighbour.distance = node.distance + 1;
    neighbour.previousNode = node;
  }
}

function getUnvisitedNeighbours(node, grid) {
  const neighbours = [];
  const { row, col } = node;

  if (row > 0) neighbours.push(grid[row - 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col < grid[row].length - 1) neighbours.push(grid[row][col + 1]);
  return neighbours.filter(neighbour => !neighbour.isVisited);
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
