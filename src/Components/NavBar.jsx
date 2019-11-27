import AppBar from "@material-ui/core/AppBar";
import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import DropDownButton from "./DropDownButton";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

export default function NavBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="regular" display="flex">
          <Typography variant="h7" color="inherit" style={{ width: "280px" }}>
            Algorithm Visualizer
          </Typography>
          <DropDownButton visualizeFunction={props.visualizeFunction} />
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={() => window.location.reload(true)}
            style={{ width: "210px" }}
          >
            Clear Board
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
