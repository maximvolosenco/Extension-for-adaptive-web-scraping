import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
 
function App() {

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Button
      variant="contained">
        Enable
      </Button>
    </div>
  );
}
 
const useStyles = makeStyles(() => ({
  container: {
    width: "600px",
    height: "400px"
  }
}));

export default App;
