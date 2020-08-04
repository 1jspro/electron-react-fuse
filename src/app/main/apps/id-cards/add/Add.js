import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useDeepCompareEffect } from "@fuse/hooks";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import _ from "@lodash";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import {
  resetIdCard,
  newIdCard,
  getIdCard,
  getMembers,
  getMembersidcard,
  saveIdCard,
} from "../store/idCardSlice";
import reducer from "../store";
import PageHeader from "./PageHeader";
import clsx from "clsx";
import FuseUtils from "@fuse/utils";
import { showMessage } from "app/store/fuse/messageSlice";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

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

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  member_id: yup.string().required("You must select the member."),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function IdCard(props) {
  const dispatch = useDispatch();
  const idCard = useSelector(({ idCardsApp }) => idCardsApp.idCard);
  const navigate = useNavigate();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noIdCard, setNoIdCard] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedUpdateImage, setSelectedUpdateImage] = useState();
  const [checked, setChecked] = useState(true);
  const [members, setMembers] = useState([]);
  const [selected_all_members, setSelectAllMembers] = useState(false);
  const [selected_members, setSelectedMembers] = useState([]);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState, setValue, getValues } =
    methods;
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  const member_id = watch("member_id");

  /* useEffect(() => {
    dispatch(getMembers()).then((action) => {
      setMembers(action.payload);
    });
  }, [dispatch]); */

  useDeepCompareEffect(() => {
    function updateIdCardState() {
      const { cardId } = routeParams;

      if (cardId === "new") {
        /**
         * Create New idCard data
         */
        dispatch(newIdCard());
        dispatch(getMembersidcard()).then((action) => {
          setMembers(action.payload);
        });
      } else {
        /**
         * Get idCard data
         */
        dispatch(getMembers()).then((action) => {
          setMembers(action.payload);
        });
        dispatch(getIdCard(routeParams)).then((action) => {
          /**
           * If the requested idCard is not exist show message
           */
          if (!action.payload) {
            setNoIdCard(true);
          } else {
          }
        });
      }
    }

    updateIdCardState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!idCard) {
      return;
    }
    /**
     * Reset the form on idCard state changes
     */
    reset(idCard);
  }, [idCard, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset idCards on component unload
       */
      dispatch(resetIdCard());
      setNoIdCard(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  const handleMemberChange = (event) => {
    let {
      target: { value },
    } = event;
    if (
      value.indexOf("all_members") != -1 &&
      selected_members.length != members.length
    ) {
      setSelectAllMembers(true);
      value = members.map((d) => {
        return d.id + "";
      });
      setSelectedMembers(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
      setValue("members[]", value);
    } else {
      setSelectAllMembers(false);
      let selectAllIndex = value.indexOf("all_members");
      if (selectAllIndex > -1) {
        value.splice(selectAllIndex, 1);
      }
      setSelectedMembers(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
      setValue("members[]", value);
    }
  };

  function handleSaveIdCard() {
    dispatch(saveIdCard(getValues())).then((action) => {
      dispatch(showMessage({ message: action.payload.message }));
      navigate("/apps/id-cards");
    });
  }

  /**
   * Show Message if the requested idCards is not exists
   */
  if (noIdCard) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such data!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/id-cards"
          color="inherit"
        >
          Go to Id Cards Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while idCard data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (idCard &&
      routeParams.cardId !== idCard.encryption_id &&
      routeParams.cardId !== "new")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <Root
        header={<PageHeader />}
        content={
          <div className="p-16 sm:p-24">
            <div className={tabValue !== 0 ? "hidden" : ""}>
              {!idCard.encryption_id && (
                <Controller
                  name="members"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-checkbox-label">
                        Members
                      </InputLabel>
                      <Select
                        {...field}
                        id="members"
                        labelId="demo-multiple-checkbox-label"
                        label="Members"
                        className="mt-8 mb-16"
                        defaultValue=""
                        multiple
                        value={selected_members}
                        onChange={handleMemberChange}
                        renderValue={(selected) => {
                          let labels = members
                            .filter((m) => {
                              if (selected.indexOf(m.id + "") != -1) {
                                return m;
                              }
                            })
                            .map((m) => {
                              return m.first_name + " " + m.last_name;
                            });
                          return labels.join(", ");
                        }}
                        MenuProps={MenuProps}
                      >
                        <MenuItem key={"0"} value={"all_members"}>
                          <Checkbox checked={selected_all_members} />
                          <ListItemText primary={"Select All"} />
                        </MenuItem>

                        {members &&
                          members.length > 0 &&
                          members.map((member) => (
                            <MenuItem
                              key={member.id + ""}
                              value={member.id + ""}
                            >
                              <Checkbox
                                checked={
                                  selected_members.indexOf(member.id + "") > -1
                                }
                              />
                              <ListItemText
                                primary={
                                  member.first_name + " " + member.last_name
                                }
                              />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}

              {idCard.encryption_id && (
                <Controller
                  name="member_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="member-simple-select-label">
                        Member*
                      </InputLabel>
                      <Select
                        {...field}
                        id="member_id"
                        labelId="member-simple-select-label"
                        label="Member*"
                        required
                        autoFocus
                        className="mt-8 mb-16 mx-4"
                        defaultValue=""
                      >
                        <MenuItem key={"0"} value={""}>
                          Select
                        </MenuItem>
                        {members &&
                          members.length > 0 &&
                          members.map((l) => (
                            <MenuItem key={l.id + ""} value={l.id + ""}>
                              {l.first_name} {l.last_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}

              <Controller
                name="valid_to"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16 mx-4"
                    label="Valid Upto"
                    type="date"
                    id="valid_to"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />

              <div className="clearfix"></div>
            </div>
            <motion.div
              className="mt30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
              <Button
                className="whitespace-nowrap mx-4 pull-right"
                variant="contained"
                color="secondary"
                disabled={
                  (!idCard.encryption_id && selected_members.length == 0) ||
                  (idCard.encryption_id && !member_id)
                }
                onClick={handleSaveIdCard}
              >
                Save
              </Button>
            </motion.div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer("idCardsApp", reducer)(IdCard);
