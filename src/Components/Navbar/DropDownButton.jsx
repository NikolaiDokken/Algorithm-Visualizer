import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

const options = [
  window.innerWidth >= 362 ? "Algorithm" : "Algo",
  "A*",
  "Dijkstra"
];

export default function DropDownButton(props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Grid container direction="column" alignItems="center">
        <Grid item xs={12}>
          <ButtonGroup ref={anchorRef}>
            <Button
              variant="outlined"
              style={{
                borderColor: "white",
                color: "white"
              }}
            >
              {options[props.currentIndex]}
            </Button>
            <Button
              variant="outlined"
              style={{ borderColor: "white", color: "white" }}
              size="small"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper className="dropdown">
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu">
                      {options.map((option, index) => (
                        <MenuItem
                          key={index}
                          selected={index === props.currentIndex}
                          onClick={event => {
                            props.setCurrentIndex(index);
                            setOpen(false);
                          }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </Grid>
    </div>
  );
}
