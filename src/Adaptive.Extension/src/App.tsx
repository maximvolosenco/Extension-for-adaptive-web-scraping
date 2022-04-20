import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from "react";
 
import { useUserService } from './hooks';
function App() {

  const { getUserInfo } = useUserService();
  const classes = useStyles();
  const [resp, setResp] = useState<any>();

  // useEffect(() => {
  // }, [])
  
  const handleClick = () => {
    console.log(resp)
    getUserInfo().then(response => setResp(response));
  }

  return (
    <div className={classes.container}>
      
      <Button
      variant="contained"
      onClick={() => handleClick()}>
        Enable
      </Button>
      <div>
        {resp}
      </div>
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
