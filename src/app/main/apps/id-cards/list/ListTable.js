import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import Checkbox from "@mui/material/Checkbox";
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { showMessage } from "app/store/fuse/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import { saveMirrorUser } from "app/auth/store/userSlice";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
import axios from "axios";
import {
  getIdCards,
  selectIdCards,
  getIdCardData,
  getAllIdCards,
} from "../store/idCardsSlice";
import ListTableHead from "./ListTableHead";
import ConfirmationDialogRaw from "./ConfirmationDialogRaw";
import IdCardTemplate from "./IdCardTemplate";
import IdCardDownloader from "./IdCardDownloader";
import useCardDownload from "./useCardDownload";
import nedb from "app/services/nedbService";

function ListTable(props) {
  const domEl = useRef(null);
  const dispatch = useDispatch();
  const idCards = useSelector(selectIdCards);
  const searchText = useSelector(
    ({ idCardsApp }) => idCardsApp.idCards.searchText
  );
  const user = useSelector(({ auth }) => auth.user);
  const permissions =
    user && user.data && user.data.permissions ? user.data.permissions : [];
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [rowItem, setRowitem] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(idCards);
  const [userData, setUserData] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [oldSearchText, setOldSearchText] = useState("");
  const { download } = useCardDownload();
  const [order, setOrder] = useState({
    direction: "desc",
    id: "created_at",
  });
  const [card, setCard] = useState({});

  const [template_type, setTemplateType] = useState("default_portrait");
  const [card_data, setCardData] = useState({});

  useEffect(() => {
    dispatch(getIdCards({ page, rowsPerPage, searchText }))
      .then((action) => {
        setData(action.payload);
      })
      .finally(function () {
        setLoading(false);
      });
  }, [dispatch]);

  const handleDownloadImages = async (item, front, back) => {
    const cardFront = document.querySelector(".card-front");
    const cardBack = document.querySelector(".card-back");

    const frontElement = document.createElement("div");
    document.body.append(frontElement);
    frontElement.innerHTML = front;
    html2canvas(frontElement, { useCORS: true, width: 600, height: 400 }).then(
      (canvas) => {
        const frontImageData = canvas.toDataURL("image/png");
        downloadImage(
          frontImageData,
          `${item.first_name}_${item.last_name}_front.png`
        );
        frontElement.remove();
      }
    );

    const backElement = document.createElement("div");
    document.body.append(backElement);
    backElement.innerHTML = back;
    html2canvas(backElement, { useCORS: true, width: 600, height: 400 }).then(
      (canvas) => {
        const backImageData = canvas.toDataURL("image/png");
        downloadImage(
          backImageData,
          `${item.first_name}_${item.last_name}_back.png`
        );
        backElement.remove();
      }
    );
  };

  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  function handleSearch(search) {
    dispatch(getIdCards({ page, rowsPerPage, searchText: search })).then(
      (action) => {
        console.log(action.payload);
        setData(action.payload);
        // if (oldSearchText != searchText) {
        //   setSearchLoading(false);
        // }
      }
    );
  }

  useEffect(() => {
    if (searchText.length > 0) {
      if (oldSearchText != searchText) {
        setPage(0);
        handleSearch(searchText);
      }
      setOldSearchText(searchText);
    } else if (oldSearchText && searchText.length == 0) {
      handleSearch("");
      setOldSearchText("");
    } else {
      /* console.log(idCards);
      setData(idCards); */
    }
  }, [idCards, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(item) {
    window.open(item.id_card_path, "_blank", "noopener,noreferrer");
  }

  function handleRemove(item) {
    setRowitem(item);

    setTimeout(() => {
      setOpen(true);
    }, 1);
  }

  function handleEdit(item) {
    props.navigate(`/apps/id-cards/${item.encryption_id}`);
  }

  async function handleDownload(item, i, data) {
    setLoading(true);
    try {
      const { data: response } = await axios.post("loadIdCard", {
        card_id: item.id,
      });
      handleSearch(searchText);
      setCard(response.data);
      setLoading(false);
      handleDownloadImages(
        item,
        response.data.renderedFront,
        response.data.renderedBack
      );
    } catch (error) {
      setLoading(false);
      console.log("ERROR", error);
    }
    /*fetch(item.id_card_path).then(response => {
        const nameStartPos = item.id_card_path.lastIndexOf("/");
        const fileName = item.id_card_path.substr(nameStartPos+1, item.id_card_path.length);

        response.blob().then(blob => {
            // Creating new object of PDF file
            const fileURL = window.URL.createObjectURL(blob);
            // Setting various property values
            let alink = document.createElement('a');
            alink.href = fileURL;
            alink.download = fileName;
            alink.click();
        });
    });*/
  }

  function handlePreview(item) {
    dispatch(getIdCardData({ member_ids: [item.member_id] })).then((action) => {
      if (action.payload.status) {
        setCardData(action.payload.data);

        let input = document.querySelector("#pdf-view");

        setTimeout(() => {
          html2canvas(input, {
            logging: true,
            letterRendering: 1,
            useCORS: true,
          }).then((canvas) => {
            const imgWidth = 208;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const imgData = canvas.toDataURL("img/png");
            const pdf = new jsPDF("p", "mm", "a4");
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("generatePdf.pdf");
          });
        }, 2000);

        // getDataUri(action.payload.data['members-data'][0].profile_pic, getDataUri(action.payload.data['adminData'].signature, createPDF));
        // setTimeout(() => {

        // html2canvas(document.querySelector('#pdf-view')).then(function(canvas){
        //     var img = canvas.toDataURL("image/png");
        //     var doc = new jsPDF('p','px',[302,475]);
        //     doc.addImage(img,'JPEG',0,0);
        //     doc.save('Test.pdf');
        // });

        /*let doc = new jsPDF("p", 'px', [302, 475]);
          doc.html(document.querySelector('#pdf-view'), {
            callback: (pdf) => {
              pdf.save('test.pdf');
            }
          });*/
        // }, 1);
      }
    });
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, value) {
    setLoading(true);
    dispatch(getIdCards({ page: value, rowsPerPage, searchText })).then(
      (action) => {
        setPage(value);
        setData(action.payload);
        setLoading(false);
      }
    );
  }

  function handleChangeRowsPerPage(event) {
    setLoading(true);
    dispatch(
      getIdCards({ page: 0, rowsPerPage: event.target.value, searchText })
    ).then((action) => {
      setPage(0);
      setRowsPerPage(event.target.value);
      setData(action.payload);
      setLoading(false);
    });
  }

  const pdfDownload = (e) => {
    e.preventDefault();
    let doc = new jsPDF("landscape", "pt", "A4");
    doc.html(document.getElementById("pdf-view"), {
      callback: () => {
        doc.save("test.pdf");
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <FuseLoading />;
  }

  if (data ? data.length === 0 : !data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There are no data!
        </Typography>
      </motion.div>
    );
  }
  return (
    <div className="w-full flex flex-col">
      <div id="domEl" ref={domEl}>
        {userData}
      </div>
      <FuseScrollbars className="tablewraper overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ListTableHead
            selectedIdCardIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {data &&
              _.orderBy(
                data,
                [
                  (o) => {
                    switch (order.id) {
                      case "full_name": {
                        return o.full_name;
                      }
                      default: {
                        return o[order.id];
                      }
                    }
                  },
                ],
                [order.direction]
              ).map((n, k) => {
                const isSelected = selected.indexOf(n.id) !== -1;
                return (
                  <TableRow
                    className="h-32 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                    onClick={(event) => handleClick(n)}
                  >
                    <TableCell
                      className="w-40 md:w-64 text-center"
                      padding="none"
                    >
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleCheck(event, n.id)}
                      />
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16 w10"
                      component="th"
                      scope="row"
                    >
                      {k + 1 + page * rowsPerPage}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      <div
                        className="flex-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {n.id_card_number}{" "}
                        <span
                          className="inline text-12 font-semibold py-2 px-8 rounded-full truncate bg-blue-700 text-white"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "fit-content",
                            gap: "2px",
                            backgroundColor:
                              n.download_color !== "" &&
                              n.download_color !== undefined
                                ? n.download_color
                                : "inherit",
                          }}
                          title={`Download Counter${
                            n.download_color !== "" &&
                            n.download_color !== undefined &&
                            n.download_color !== null
                              ? `\nID card color: ${n.download_color}`
                              : ""
                          }`}
                        >
                          <Icon className="text-white text-12 ">get_app</Icon>
                          {n.download_count}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.first_name} {n.last_name}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.valid_from}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.valid_to ? n.valid_to : "-"}
                    </TableCell>

                    {/* <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >

                    </TableCell> */}

                    {(permissions.indexOf("id-cards:edit") > -1 ||
                      permissions.indexOf("id-cards:delete") > -1) && (
                      <TableCell
                        className="p-4 md:p-16"
                        component="th"
                        scope="row"
                        align="right"
                      >
                        {permissions.indexOf("id-cards:edit") > -1 && (
                          <Icon
                            title="Regenerate"
                            className="text-black text-20 mr5"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEdit(n);
                            }}
                          >
                            refresh
                          </Icon>
                        )}
                        {permissions.indexOf("id-cards:read") > -1 && (
                          <Icon
                            title="Download"
                            className="text-black text-20 mr5"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDownload(n, k, data);
                            }}
                          >
                            get_app
                          </Icon>
                        )}
                        {/*{permissions.indexOf("id-cards:read") > -1 && <Icon title="Preview" className="text-black text-20 mr5" onClick={(event) => {event.stopPropagation();handlePreview(n);}}>visibility</Icon>}*/}
                        {/*{permissions.indexOf("id-cards:delete") > -1 && <Icon title="Remove" className="text-red text-20" onClick={(event) => {event.stopPropagation();handleRemove(n);}}>delete</Icon>}*/}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={data[0].totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ConfirmationDialogRaw
        id="deleteDialog"
        keepMounted
        open={open}
        onClose={handleClose}
        value={rowItem}
      />

      {/* <IdCardDownloader /> */}

      {/*<div style={{'position': 'absolute','width': '100%', 'height': 'auto','zIndex': -1}} >*/}
      <div>
        <div id="pdf-view" style={{ width: "302px" }}>
          <IdCardTemplate type={template_type} data={card_data} />
        </div>
      </div>
    </div>
  );
}

export default withRouter(ListTable);
