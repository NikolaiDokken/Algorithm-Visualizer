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
let prevX = 0,
  prevY = 0;

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
    this.touchHandler = this.touchHandler.bind(this);
    this.init = this.init.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  touchHandler(event) {
    var touches = event.changedTouches,
      first = touches[0],
      type = "";
    switch (event.type) {
      case "touchstart":
        type = "mousedown";
        break;
      case "touchmove":
        type = "mousemove";
        break;
      case "touchend":
        type = "mouseup";
        break;
      default:
        return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
      type,
      true,
      true,
      window,
      1,
      first.screenX,
      first.screenY,
      first.clientX,
      first.clientY,
      false,
      false,
      false,
      false,
      0 /*left*/,
      null
    );
    const node = document
      .elementFromPoint(first.clientX, first.clientY)
      .id.split("-");

    if (node[1] !== undefined && node[2] !== undefined) {
      if (event.type === "touchstart") {
        this.handleMouseDown(node[1], node[2]);
      }
      if (node[1] !== prevX || node[2] !== prevY) {
        this.handleMousEnter(parseInt(node[1]), parseInt(node[2]));
      }
    }
    if (event.type === "touchend") {
      prevX = 0;
      prevY = 0;
      this.handleMouseUp();
      const newGrid = getNewGridWithUpdatedStartFinish(this.state.grid);
      this.setState({ grid: newGrid });
    }
    first.target.dispatchEvent(simulatedEvent);
    if (event.type !== "touchend") {
      prevX = node[1];
      prevY = node[2];
    }
    event.preventDefault();
  }

  init() {
    const targetElement = document.querySelector("#grid");
    targetElement.addEventListener("touchstart", this.touchHandler, true);
    targetElement.addEventListener("touchmove", this.touchHandler, true);
    targetElement.addEventListener("touchend", this.touchHandler, true);
    targetElement.addEventListener("touchcancel", this.touchHandler, true);
  }

  clearGrid(initialLoad) {
    const grid = getInitialGrid(initialLoad);
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
    this.init();
    this.clearGrid(true);
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
        <div className="grid" id="grid">
          {grid.map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="grid-row">
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

const getInitialGrid = initalLoad => {
  const grid = [];
  let amtCols = Math.floor(window.innerWidth / 38);
  const squareWidth = Math.floor(window.innerWidth / amtCols);
  let amtRows = Math.floor((window.innerHeight - 80) / squareWidth);
  if (initalLoad) {
    START_NODE_COL = Math.floor(amtCols / 3) - 1;
    START_NODE_ROW = Math.floor(amtRows / 2);
    FINISH_NODE_COL = Math.floor((amtCols * 2) / 3) + 1;
    FINISH_NODE_ROW = Math.floor(amtRows / 2);
  }
  for (let row = 0; row < amtRows; row++) {
    const currentRow = [];
    for (let col = 0; col < amtCols; col++) {
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
  let amtCols = Math.floor(window.innerWidth / 38);
  const squareWidth = Math.floor(window.innerWidth / amtCols);
  let amtRows = Math.floor((window.innerHeight - 80) / squareWidth);

  for (let row = 0; row < amtRows; row++) {
    const currentRow = [];
    for (let col = 0; col < amtCols; col++) {
      currentRow.push(createNode(row, col, currentGrid[row][col].isWall));
    }
    newGrid.push(currentRow);
  }
  return newGrid;
};
