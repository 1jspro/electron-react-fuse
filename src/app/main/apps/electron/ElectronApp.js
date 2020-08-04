import DemoContent from "@fuse/core/DemoContent";
import { styled } from "@mui/material/styles";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { ipcRenderer } from "electron";

const Root = styled(FusePageSimple)({
  "& .FusePageSimple-header": {},
  "& .FusePageSimple-toolbar": {},
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
});

function DashboardPage(props) {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  function handleChange(e) {
    setIp(e.target.value);
  }
  function onFetch() {
    setLoading(true);
    ipcRenderer.send("fetch-data", ip);
    ipcRenderer.on("finish-fetch", () => {
      setLoading(false);
    });
  }
  function ValidateIPaddress(ipaddress) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
      )
    ) {
      return true;
    }
    return false;
  }
  const valid = ValidateIPaddress(ip);
  return (
    <Root
      header={
        <div className="p-24">
          <h4>Electron Database</h4>
        </div>
      }
      contentToolbar={
        <div className="px-24">
          <h4>You can fetch data from other computer</h4>
        </div>
      }
      content={
        <div className="flex">
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              disabled={!valid}
              color="success"
              onClick={onFetch}
            >
              Fetch
            </Button>
          )}
          <TextField
            error={!valid}
            className="mx-16"
            helperText={valid ? undefined : "This is not valid ip address"}
            value={ip}
            onChange={handleChange}
          ></TextField>
        </div>
      }
    />
  );
}

export default DashboardPage;
