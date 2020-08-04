import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
const useCardDownload = () => {
  const download = (front = '', userData = null, index = '') => {
    front.replace(/'card-front'/g, `card-front card-front${index}`)
    .replace(/'card-back'/g, `card-back card-back${index}`);
    const frontCard = document.createElement("div");
    frontCard.setAttribute("id", index + "down");
    frontCard.innerHTML = front;
    document.body.append(frontCard);
    /* document.getElementsByClassName("info-title")[0].style.display = "block";
    document.getElementsByClassName("info-title")[0].style.width = "200px";
    document.getElementsByClassName("info-title")[1].style.display = "block";
    document.getElementsByClassName("info-title")[1].style.width = "200px";
    document.getElementsByClassName("user-info")[3].style.width = "140px";
    // document.getElementsByClassName("sub-heading-text")[0].style.width ="340px";
    document.getElementsByClassName("sub-heading-text")[0].style.overflow = "hidden";
    document.getElementsByClassName("sub-heading-text")[0].style.whiteSpace = "nowrap";
    document.getElementsByClassName("sub-heading-text")[0].style.textOverflow = "ellipsis";
    document.getElementsByClassName("sub-heading-text")[0].style.maxWidth = "100%";
    document.getElementsByClassName("info-content-last")[0].style.width = "200px";
    document.getElementsByClassName("info-content-last")[0].style.textAlign = "left";
    document.getElementsByClassName("sub-heading")[0].style.width = "100%";
    document.getElementsByClassName("sub-heading")[0].style.textAlign = "left";
    document.getElementsByClassName("info-content")[1].style.whiteSpace = "nowrap";
    document.getElementsByClassName("info-content")[1].style.maxWidth = "100%";
    document.getElementsByClassName("designation")[0].style.padding = "4px 5px";
    document.getElementsByClassName("designation")[0].style.overflow = "hidden";
    document.getElementsByClassName("designation")[0].style.whiteSpace = "nowrap";
    document.getElementsByClassName("designation")[0].style.textOverflow = "ellipsis";
    document.getElementsByClassName("designation")[0].style.width = "30%";
    document.getElementsByClassName("user-info-last")[0].style.display = "inline"; */

    /* document.getElementById(index + "down").getElementsByClassName("sub-heading-text")[0].style.width ="auto";
    document.getElementById(index + "down").getElementsByClassName("sub-heading-text")[0].style.maxWidth = "100%";
    document.getElementById(index + "down").getElementsByClassName("sub-heading")[0].style.width = "auto"; */

    document.getElementById(index + "down").getElementsByClassName("content-row")[0].style.display = "block";
    document.getElementById(index + "down").getElementsByClassName("content-row")[1].style.display = "block";
    document.getElementById(index + "down").getElementsByClassName("content-row")[2].style.display = "inline-block";
    document.getElementById(index + "down").getElementsByClassName("content-row")[2].style.width = "100%";
    document.getElementById(index + "down").getElementsByClassName("content-row")[2].getElementsByClassName("user-info")[0].style.float = "left";
    document.getElementById(index + "down").getElementsByClassName("content-row")[2].getElementsByClassName("user-info")[1].style.float = "left";
    document.getElementById(index + "down").getElementsByClassName("content-row")[2].getElementsByClassName("user-info")[1].style.width = parseInt(document.getElementById(index + "down").getElementsByClassName("content-row")[2].getElementsByClassName("user-info")[1].offsetWidth+4)+'px';

    setTimeout(async () => {
      const tempFDiv = document.getElementById(index + "down").getElementsByClassName(`card-front`)[0];
      tempFDiv.style.margin = 0;
      const tempBDiv = document.getElementById(index + "down").getElementsByClassName(`card-back`)[0];
      tempBDiv.style.margin = 0;
      let _fileName = Date.now();
      if (userData) {
        _fileName = `${userData.first_name}_${userData.last_name}`;
      }

      // htmlToImage.toPng(tempFDiv).then((dataUrl) => {
      //   // dataUrl = dataUrl.toDataURL();
      //   var __fileName = `${_fileName}_front.png`;
      //   const f_link = document.createElement("a");
      //   f_link.download = __fileName;
      //   f_link.href = dataUrl;
      //   f_link.click();
      //   tempFDiv.remove();
      //   /* frontCard.remove(); */
      // });
      html2canvas(tempFDiv, { useCORS: true }).then((canvas) => {
        const frontImageData = canvas.toDataURL('image/png');
        var __fileName = `${_fileName}_front.png`;
        const f_link = document.createElement("a");
        f_link.download = __fileName;
        f_link.href = frontImageData;
        f_link.click();
        tempFDiv.remove();
      })
      // htmlToImage.toPng(tempBDiv).then((dataUrl) => {
      //   var __fileName = `${_fileName}_back.png`;
      //   const b_link = document.createElement("a");
      //   b_link.download = __fileName;
      //   b_link.href = dataUrl;
      //   b_link.click();
      //   tempBDiv.remove();
      //   frontCard.remove();
      // });
      html2canvas(tempBDiv, { useCORS: true }).then((canvas) => {
        const frontImageData = canvas.toDataURL('image/png');
        var __fileName = `${_fileName}_back.png`;
        const b_link = document.createElement("a");
        b_link.download = __fileName;
        b_link.href = frontImageData;
        b_link.click();
        tempBDiv.remove();
        frontCard.remove();
      });
    }, 1000);
  };
  return { download };
};
export default useCardDownload;
