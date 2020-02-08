import React, { Component } from "react";
import Node from "./Node/Node";
import {
  dijkstra,
  getNodesInShortestPathOrder
} from "../algorithms/dijkstraAndAstar";
import Navbar from "../Components/Navbar/Navbar";

import "./PathfinderVisualizer.css";

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

export default class PathfinderVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startIsPressed: false,
      finishIsPressed: false
    };
    this.visualizeDijkstra = this.visualizeDijkstra.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
  }

  clearGrid() {
    const grid = getInitialGrid();
    this.setState({ grid });
    setTimeout(() => {
      grid.map(row =>
        row.map(node => {
          const extraClassName = node.isFinish
            ? "node-finish"
            : node.isStart
            ? "node-start"
            : node.isWall
            ? "node-wall"
            : "";
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = `node ${extraClassName}`;
          return null;
        })
      );
    }, 0);
  }

  componentDidMount() {
    this.clearGrid();
  }

  handleMouseDown(row, col) {
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      this.setState({ startIsPressed: true });
    } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      this.setState({ finishIsPressed: true });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMousEnter(row, col) {
    if (this.state.startIsPressed) {
      START_NODE_ROW = row;
      START_NODE_COL = col;
      const newGrid = getNewGridWithUpdatedStartFinish(this.state.grid);
      this.setState({ grid: newGrid });
    } else if (this.state.finishIsPressed) {
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
      const newGrid = getNewGridWithUpdatedStartFinish(this.state.grid);
      this.setState({ grid: newGrid });
    } else {
      if (!this.state.mouseIsPressed) return;
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
    this.setState({ startIsPressed: false });
    this.setState({ finishIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra(aStar) {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode, aStar);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <div>
        <Navbar
          visualizeFunction={this.visualizeDijkstra}
          clearGrid={this.clearGrid}
        />
        <div className="grid">
          {grid.map((row, rowIndex) => {
            return (
              <div
                key={rowIndex}
                className="grid-row"
                style={{ margin: "0", padding: "0" }}
              >
                {row.map((node, nodeIndex) => {
                  const { row, col, isStart, isFinish, isWall } = node;
                  return (
                    <Node
                      key={nodeIndex}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMousEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      style={{ margin: "0" }}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col, false));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col, isWallBool) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isWall: isWallBool,
    previousNode: null
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithUpdatedStartFinish = currentGrid => {
  const newGrid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col, currentGrid[row][col].isWall));
    }
    newGrid.push(currentRow);
  }
  return newGrid;
};
