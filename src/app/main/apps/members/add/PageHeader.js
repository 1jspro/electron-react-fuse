import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Backdrop from "@mui/material/Backdrop";
import Checkbox from "@mui/material/Checkbox";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTheme } from "@mui/material/styles";
import { showMessage } from "app/store/fuse/messageSlice";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  saveMember,
  removeMember,
  getLevels,
  saveDefaultFormFormat,
} from "../store/memberSlice";
import { getAdminProfile } from "../../admins/store/adminsSlice";
import genericDefaultFormFormat from "../../../utils/defaultFormFormat";

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function PageHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const name = watch("name");
  const breed_id = watch("breed_id");
  const id = watch("id");
  const theme = useTheme();
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [open, setOpen] = useState(false);
  const [isSavingDefaultForm, setIsSavingDefaultForm] = useState(false);
  // const [items, setItems] = useState([
  //   { id: 'checkbox1', label: 'Checkbox 1', position: 0, checked: false },
  //   { id: 'checkbox2', label: 'Checkbox 2', position: 1, checked: false },
  //   { id: 'checkbox3', label: 'Checkbox 3', position: 2, checked: false },
  // ]);
  const [items, setItems] = useState(genericDefaultFormFormat);

  const user = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    dispatch(getLevels()).then((action) => {
      setLevels(action.payload);
    });
  }, [dispatch]);

  function handleSaveMember() {
    dispatch(saveMember(getValues())).then((action) => {
      if (action.payload && action.payload.error && action.payload.error[0]) {
        dispatch(showMessage({ message: action.payload.error[0].message }));
      } else {
        dispatch(showMessage({ message: action.payload.message }));
        navigate("/apps/members");
      }
    });
  }

  function handleRemoveMember() {
    dispatch(removeMember()).then(() => {
      navigate("/apps/members");
    });
  }

  function handleSaveDefaultFormFormat() {
    setIsSavingDefaultForm(true);
    dispatch(saveDefaultFormFormat(items))
      .then((action) => {
        dispatch(showMessage({ message: action.payload.message }));
        props.onDefaultFormMod(items);
        setOpen(false);

        setIsSavingDefaultForm(false);
      })
      .catch((e) => {
        dispatch(showMessage({ message: "Failed to save settings" }));
        setIsSavingDefaultForm(false);
      });
  }

  function handleInitialSetDefaultForm() {
    dispatch(getAdminProfile()).then((userAction) => {
      const userData = userAction.payload;
      const formFormat = userData?.user_data?.other_settings;
      if (formFormat) {
        setItems(formFormat);
        props.onDefaultFormMod(formFormat);
      } else {
        props.onDefaultFormMod(items);
      }
    });
  }

  function openEditModal() {
    setOpen(true);
  }

  function closeEditModal() {
    setOpen(false);
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedItems = Array.from(items);
    const [removed] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, removed);

    const updatedItemsWithPositions = updatedItems.map((item, index) => ({
      ...item,
      position: index,
    }));

    setItems(updatedItemsWithPositions);
  };

  const handleCheckboxChange = (event, checkboxId) => {
    const updatedItems = items.map((item) => {
      if (item.id === checkboxId) {
        return {
          ...item,
          checked: event.target.checked,
        };
      }
      return item;
    });

    setItems(updatedItems);
  };

  useEffect(() => {
    handleInitialSetDefaultForm();
  }, []);

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex flex-col items-start w-full max-w-full min-w-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component={Link}
            role="button"
            to="/apps/members"
            color="inherit"
          >
            <Icon className="text-20">
              {theme.direction === "ltr" ? "arrow_back" : "arrow_forward"}
            </Icon>
            <span className="hidden sm:flex mx-4 font-medium">Members</span>
          </Typography>
        </motion.div>

        <div className="flex items-center w-full max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            <img
              className="w-32 sm:w-48 rounded"
              src="assets/images/ecommerce/product-image-placeholder.png"
              alt={name}
            />
          </motion.div>
          <div className="flex items-center min-w-0 w-full mx-8 sm:mc-16">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {name || "New Member"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Member Detail
              </Typography>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        {user.role.length > 0 && (
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            onClick={openEditModal}
            startIcon={<Icon className="hidden sm:flex">edit</Icon>}
          >
            Edit form
          </Button>
        )}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={closeEditModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                className="white-text"
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Edit Form
              </Typography>
              <Typography
                className="mb30 white-text"
                variant="body2"
                gutterBottom
              >
                Order form inputs and check the ones you want display.
              </Typography>
              <form
                className="flex flex-col justify-center w-full h-[60vh] overflow-auto"
                onSubmit={() => {}}
              >
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="checkboxList">
                    {(providedDroppable, snapshotDraggable) => (
                      <ul
                        className="h-[60vh]"
                        {...providedDroppable.droppableProps}
                        ref={providedDroppable.innerRef}
                      >
                        {items.map((checkbox, index) => (
                          <Draggable
                            key={checkbox.id}
                            draggableId={checkbox.id}
                            index={index}
                          >
                            {(providedDraggable) => {
                              const {
                                draggableProps,
                                dragHandleProps,
                                innerRef,
                              } = providedDraggable;
                              return (
                                <li
                                  className="white-text flex items-center"
                                  {...draggableProps}
                                  {...dragHandleProps}
                                  ref={innerRef}
                                  style={{
                                    ...draggableProps.style,
                                    top: "0 !important,",
                                    left: "0 !important",
                                  }}
                                >
                                  <Icon className="mr-8">drag_indicator</Icon>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={checkbox.disabled}
                                        checked={checkbox.checked}
                                        onChange={(event) =>
                                          handleCheckboxChange(
                                            event,
                                            checkbox.id
                                          )
                                        }
                                      />
                                    }
                                    label={checkbox.label}
                                  />
                                </li>
                              );
                            }}
                          </Draggable>
                        ))}
                        {providedDroppable.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </form>
              <Button
                type="button"
                onClick={handleSaveDefaultFormFormat}
                className="whitespace-nowrap mx-4 mt-30 w-full"
                variant="contained"
                color="secondary"
                disabled={isSavingDefaultForm}
                style={{ opacity: isSavingDefaultForm ? "0.27" : "1" }}
                startIcon={<Icon className="hidden sm:flex">save</Icon>}
              >
                {isSavingDefaultForm ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Fade>
        </Modal>
      </motion.div>
    </div>
  );
}

export default PageHeader;
