import Card from "@mui/material/Card";
import { styled, darken } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import { useDeepCompareEffect } from "@fuse/hooks";
import { useDispatch } from "react-redux";
import { Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import JWTLoginTab from "./tabs/JWTLoginTab";
import History from "@history/@history";
import { useEffect } from "react";

const Root = styled("div")(({ theme }) => ({
  background: `linear-gradient(to right, ${
    theme.palette.primary.dark
  } 0%, ${darken(theme.palette.primary.dark, 0.5)} 100%)`,
  color: theme.palette.primary.contrastText,

  "& .Login-leftSection": {},

  "& .Login-rightSection": {
    background: `linear-gradient(to right, ${
      theme.palette.primary.dark
    } 0%, ${darken(theme.palette.primary.dark, 0.5)} 100%)`,
    color: theme.palette.primary.contrastText,
  },
}));

function Login() {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const routeParams = useParams();

  useEffect(
    function () {
      if (!window.navigator.onLine) {
        History.push("apps/members");
      }
    },
    [dispatch, window.navigator.onLine]
  );

  useDeepCompareEffect(() => {
    function doAutoLogin() {
      const { token } = routeParams;

      if (token) {
        localStorage.setItem("jwt_access_token", token);
        localStorage.setItem("muid", "");
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        window.location.reload();
      }
    }

    doAutoLogin();
  }, [routeParams]);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  return (
    <Root className="flex flex-col flex-auto items-center justify-center shrink-0 p-16 md:p-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-400 md:max-w-3xl rounded-20 shadow-2xl overflow-hidden"
      >
        <Card
          className="Login-leftSection flex flex-col w-full max-w-sm items-center justify-center shadow-0"
          square
        >
          <CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <div className="flex items-center mb-48">
                <img
                  className="logo-icon w-48"
                  src="assets/images/logos/logo_main.png"
                  alt="logo"
                />
                <div className="border-l-1 mr-4 w-1 h-40" />
                <div>
                  <Typography
                    className="text-24 font-semibold logo-text"
                    color="inherit"
                  >
                    DMS
                  </Typography>
                </div>
              </div>
            </motion.div>

            {selectedTab === 0 && <JWTLoginTab />}
          </CardContent>

          <div className="flex flex-col items-center justify-center pb-32">
            <div>
              <Link className="font-normal" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>

          {(process.env.NODE_ENV === "development" ||
            !window.navigator.onLine) && (
            <div className="flex flex-col items-center justify-center pb-32">
              <Button component={Link} to="/apps/members">
                Offline Mode
              </Button>
            </div>
          )}
        </Card>

        <div className="Login-rightSection hidden md:flex flex-1 items-center justify-center p-64">
          <div className="max-w-350">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
              <Typography
                mb={4}
                variant="h3"
                color="inherit"
                className="font-semibold leading-tight text-center"
              >
                {/* Welcome <br />
                to the <br /> DMS! */}
                Welcome <br /> to <br /> DataMonk
              </Typography>
              <Typography
                variant="h5"
                color="inherit"
                className="font-light leading-tight"
              >
                Your Ultimate Database management software
              </Typography>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Root>
  );
}

export default Login;
