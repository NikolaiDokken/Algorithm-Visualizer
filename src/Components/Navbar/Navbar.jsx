import AppBar from "@material-ui/core/AppBar";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Hidden
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import DropDownButton from "./DropDownButton";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 0
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

export default function Navbar(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleClose() {
    setOpen(false);
  }
  function handleClickOpen() {
    setOpen(true);
  }

  const handleRun = () => {
    if (currentIndex === 0) {
      return null;
    } else if (currentIndex === 1) {
      props.visualizeFunction(true);
    } else if (currentIndex === 2) {
      props.visualizeFunction(false);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#000" }}>
        <Toolbar>
          <Hidden smDown>
            <Typography color="inherit" style={{ width: "280px" }}>
              Shortest path Algorithm Visualizer
            </Typography>
          </Hidden>
          <Grid container justify="center">
            <DropDownButton
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
            <Button
              variant="contained"
              endIcon={<PlayArrowIcon />}
              style={{ background: "limegreen", margin: "0 10px 0 10px" }}
              onClick={handleRun}
              elevation={0}
              disableElevation
            >
              {window.innerWidth >= 680 ? "Run" : null}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<DeleteIcon />}
              onClick={() => props.clearGrid(false)}
              disableElevation
              elevation={0}
            >
              {window.innerWidth >= 680 ? "Clear Board" : null}
            </Button>
          </Grid>
          <div>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClickOpen}
            >
              Help
            </Button>
            <Dialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Instructions
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  1. Pick an algorithm{" "}
                  <font color="#0328fc">(Blue button)</font>
                  <br /> 2. (Optional) Draw walls by dragging/clicking squares.
                  <br /> 3. (Optional) Move start/end node by dragging them to
                  another square.
                  <br /> 4. Run the algorithm{" "}
                  <font color="limegreen">(Green button)</font>
                  <br /> 5. Clear the board to go again.
                  <font color="red">(Red button).</font> Start/end node will
                  remain at same place
                  <br />
                  <br />
                  Mobile users: View the page in landscape mode to get a bigger
                  grid.
                  <br />
                  Drawing walls by dragging on mobile is currently not possible,
                  I am working on fixing this!
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
