import FuseLoading from "@fuse/core/FuseLoading";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FusePageCarded from "@fuse/core/FusePageCarded";
import "font-awesome/css/font-awesome.min.css";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import DOMPurify from "dompurify";
import path from "path";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import PageHeader from "./PageHeader";
import {
  getMember,
  getAllParentLevels,
  getDynamicForms,
} from "../store/memberSlice";
import { Link, useParams, useNavigate } from "react-router-dom";

const Root = styled(FusePageCarded)(({ theme }) => ({
  "& .FusePageCarded-header": {
    minHeight: 72,
    height: 72,
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      minHeight: 136,
      height: 136,
    },
  },

  "& .FusePageCarded-toolbar": {
    minHeight: 72,
    height: 72,
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      minHeight: 110,
      height: 110,
    },
  },

  "& .productImageUpload": {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },

  "& .productImageItem": {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    "&:hover": {
      "& .productImageFeaturedStar": {
        opacity: 0.8,
      },
    },
    "&.featured": {
      pointerEvents: "none",
      boxShadow: theme.shadows[3],
      "& .productImageFeaturedStar": {
        opacity: 1,
      },
      "&:hover .productImageFeaturedStar": {
        opacity: 1,
      },
    },
  },
}));

function Details() {
  const dispatch = useDispatch();
  const routeParams = useParams();

  const [selectedTab, setSelectedTab] = useState(0);
  const [member, setMember] = useState({});
  const [levels, setLevels] = useState([]);
  const [dynamic_forms, setDynamicForms] = useState([]);
  const [extra_field, setExtraFields] = useState({});
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const user = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    dispatch(getMember(routeParams)).then((action) => {
      setMember(action.payload);
      if (action.payload.extra_field) {
        let extraField = JSON.parse(action.payload.extra_field);
        setExtraFields(extraField);
      }
      if (user.role.length === 0) {
        dispatch(
          getAllParentLevels({ parent_id: action.payload.level_data_id })
        ).then((action) => {
          let listdata = [];
          for (let x in action.payload.data.parents) {
            listdata.push(action.payload.data.parents[x]);
          }
          setLoading(false);

          setLevels(listdata);
        });
      } else {
        setLoading(false);
      }
    });
    dispatch(getDynamicForms()).then((action) => {
      setDynamicForms(action.payload);
    });
  }, [dispatch]);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  function handleRedirect(url) {
    // body...
    window.open(url, "_blank");
  }

  /**
   * Wait while member data is loading
   */
  if (loading) {
    return <FuseLoading />;
  }

  return (
    <Root
      header={<PageHeader />}
      contentToolbar={
        <>
          <div className="w-full px-24  flex flex-col md:flex-row flex-1 items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { delay: 0.1 } }}
            >
              {member.profile_pic ? (
                <img
                  className="roundImg  w-7 h-7"
                  src={path.join(process.cwd(), "pic", member.profile_pic)}
                />
              ) : (
                <img
                  className="roundImg  w-7 h-7"
                  src="assets/images/logos/user.png"
                />
              )}
            </motion.div>

            <div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {member.first_name + " " + member.last_name}
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {member.email && (
                    <>
                      {"Email ID:"}{" "}
                      <small className="text-grey font-medium">
                        {" "}
                        {member.email}{" "}
                      </small>
                    </>
                  )}
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-16 md:text-20 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {"Phone No:"}{" "}
                  <small className="text-grey font-medium">
                    {" "}
                    {member.phone_no}{" "}
                  </small>
                </Typography>
              </motion.div>
            </div>
          </div>
        </>
      }
      content={
        <div className="p-16 sm:p-24">
          <div>
            <table className="detailTable infoTable">
              <tbody>
                <tr>
                  <th className="titleWidth" align="left">
                    First Name:{" "}
                  </th>
                  <td align="left">
                    {member.first_name ? member.first_name : "-"}
                  </td>
                  <th className="titleWidth" align="left">
                    Last Name:
                  </th>
                  <td align="left">
                    {member.last_name ? member.last_name : "-"}
                  </td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">
                    Gender:
                  </th>
                  <td align="left">{member.gender ? member.gender : "-"}</td>
                  <th className="titleWidth" align="left">
                    ID Card Number:{" "}
                  </th>
                  <td align="left">
                    {member.id_card_number ? member.id_card_number : "-"}
                  </td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">
                    ID Type:{" "}
                  </th>
                  <td align="left">{member.id_type ? member.id_type : "-"}</td>
                  <th className="titleWidth" align="left">
                    Id Number:
                  </th>
                  <td align="left">
                    {member.id_number ? member.id_number : "-"}
                  </td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">
                    Telephone number:{" "}
                  </th>
                  <td align="left">
                    {member.phone_no ? member.phone_no : "-"}
                  </td>
                  <th className="titleWidth" align="left">
                    Email:
                  </th>
                  <td align="left">{member.email ? member.email : "-"}</td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">
                    Education Level:{" "}
                  </th>
                  <td align="left">
                    {member.education_level_name
                      ? member.education_level_name
                      : "-"}
                  </td>
                  <th className="titleWidth" align="left">
                    Industry:
                  </th>
                  <td align="left">
                    {member.industry_name ? member.industry_name : "-"}
                  </td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">
                    Profession:{" "}
                  </th>
                  <td align="left">
                    {member.profession_name ? member.profession_name : "-"}
                  </td>
                  <th className="titleWidth" align="left">
                    Employment Status:
                  </th>
                  <td align="left">
                    {member.employment_status ? member.employment_status : "-"}{" "}
                  </td>
                </tr>
                {levels &&
                  levels.length > 0 &&
                  levels.map((level, k) => (
                    <tr key={"l_" + k}>
                      <th className="titleWidth" align="left">
                        {level.level.name}:{" "}
                      </th>
                      <td colSpan="3" align="left">
                        {level.name ? level.name : "-"}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <th className="titleWidth" align="left">
                    Date of Joining:{" "}
                  </th>
                  <td align="left">
                    {member.date_year_of_joining
                      ? member.date_year_of_joining
                      : "-"}
                  </td>
                  <th className="titleWidth" align="left">
                    Date of Birth:
                  </th>
                  <td align="left">{member.dob ? member.dob : "-"} </td>
                </tr>
                <tr>
                  <th className="titleWidth" align="left">
                    Whats your Position?:{" "}
                  </th>
                  <td align="left">
                    {member.position_name ? member.position_name : "-"}
                  </td>
                  <th className="titleWidth" align="left">
                    Status:
                  </th>
                  <td align="left">{member.status ? member.status : "-"} </td>
                </tr>
                {dynamic_forms &&
                  dynamic_forms.length > 0 &&
                  dynamic_forms.map((form, k) => (
                    <tr key={"f_" + k}>
                      <th className="titleWidth" align="left">
                        {form.label}:{" "}
                      </th>
                      <td colSpan="3" align="left">
                        {extra_field && extra_field[form.id]
                          ? extra_field[form.id]
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    />
  );
}

export default Details;
