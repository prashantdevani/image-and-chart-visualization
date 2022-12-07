let currentX: number | null;
let currentY: number | null;
let currentID = Math.random();

const storageComments = sessionStorage.getItem("comments");
let comments: {
  id: number;
  points: { x: number; y: number };
  description: string;
}[] = [];

if (comments.length === 0 && storageComments) {
  comments.push(...JSON.parse(storageComments));
}

const createDot = (x: number, y: number, message: string) => {
  const div = document.createElement("div");
  div.id = `dot_${x}_${y}`;
  div.className = "redDot";
  div.style.top = y + "px";
  div.style.left = x + "px";
  div.dataset.x = x.toString();
  div.dataset.y = y.toString();
  div.addEventListener("mouseover", redDotMouseOver);
  div.addEventListener("mouseout", redDotMouseOut);

  const messageElm = document.createElement("div");
  messageElm.id = `message_${x}_${y}`;
  messageElm.innerHTML = message;
  messageElm.className = "message";
  div.appendChild(messageElm);
  document.body.appendChild(div);
};

const renderImageInfo = (
  name: string,
  type: string,
  width: number,
  height: number
) => {
  const imageInfo = document.getElementById("image-info");
  if (imageInfo) {
    imageInfo.innerHTML = `
    <table>
    <tr>
      <th>Name</th>
      <td>${name}</td>
    </tr>
    <tr>
      <th>Dimension</th>
      <td>${width} x ${height}</td>
    </tr>
    <tr>
      <th>MEMI Type</th>
      <td>${type}</td>
    </tr>
  </table>`;
  }
  sessionStorage.setItem(
    "imageInfo",
    JSON.stringify({
      name: name,
      type: type,
      width: width,
      height: height,
    })
  );
};

const imageInfo = sessionStorage.getItem("imageInfo");

if (imageInfo) {
  const image = JSON.parse(imageInfo);
  renderImageInfo(image.name, image.type, image.width, image.height);
}

const renderTable = () => {
  const table = document.getElementById("table-content");

  let html = `<table>
  <tr>
    <th>X pos</th>
    <th>Y pos</th>
    <th>Description</th>
  </tr>
`;
  let rows = "";
  comments.forEach((comment) => {
    rows += `<tr>
    <td>${comment.points.x}</td>
    <td>${comment.points.y}</td>
    <td>${comment.description}</td>
  </tr>`;
  });
  html += rows;
  html += `</table>`;

  if (table) {
    table.innerHTML = html.toString();
  }
};

const renderAllComments = () => {
  const selectAllRedDots = document.querySelectorAll(".redDot");
  if (selectAllRedDots) {
    selectAllRedDots.forEach((elm) => {
      elm.remove();
    });
  }
  comments.forEach((comment) => {
    createDot(comment.points.x, comment.points.y, comment.description);
  });
  sessionStorage.setItem("comments", JSON.stringify(comments));
  renderTable();
};

const setImage = (file: string) => {
  var output =
    (document.getElementById("imagePreview") as HTMLImageElement) || null;
  if (file && output) {
    output.src = file?.toString() || "";
  }
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }

  const commentMessage = <HTMLInputElement>document.getElementById("comment");
  if (commentMessage) {
    commentMessage.value = "";
  }
};

const clearHandler = () => {
  comments = [];
  renderAllComments();
  closeModal();
};

const redDotMouseOver = (event: Event) => {
  setRedDotVisibility("show", event);
};

const redDotMouseOut = (event: Event) => {
  setRedDotVisibility("hide", event);
};

const setRedDotVisibility = (visibility: "show" | "hide", event: Event) => {
  const target: any = event?.target;
  const x = target.dataset.x;
  const y = target.dataset.y;
  const messageID = `message_${x}_${y}`;
  const messageElm = document.getElementById(messageID);
  if (messageElm && visibility === "show") {
    messageElm.style.display = "block";
  } else if (messageElm && visibility === "hide") {
    messageElm.style.display = "none";
  }
  closeModal();
};

const onCommentSubmit = (event: Event) => {
  if (currentX !== null && currentY !== null) {
    const descriptionMessage =
      (<HTMLInputElement>document.getElementById("comment"))?.value || "";

    currentID++;
    comments.push({
      id: currentID,
      points: { x: currentX, y: currentY },
      description: descriptionMessage,
    });
    renderAllComments();
    closeModal();
  }
  return false;
};

const onSelectImage = (file: Event) => {
  const input: any = file.target;
  if (input) {
    const file: File = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = reader.result?.toString() || "";
      setImage(img);
      clearHandler();
      const image = new Image();
      image.src = img;
      image.onload = function () {
        renderImageInfo(file.name, file.type, image.width, image.height);
      };
      sessionStorage.setItem("image", img);
    };
    reader.readAsDataURL(file);
  }
};

const onCancelHandler = () => {
  closeModal();
};

const onImageClick = (event: PointerEvent) => {
  currentX = event?.pageX;
  currentY = event?.pageY;
  const x = event?.pageX.toString();
  const y = event?.pageY.toString();

  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "block";
    modal.style.top = y + "px";
    modal.style.left = x + "px";
  }
};

window.addEventListener("load", () => {
  const img = sessionStorage.getItem("image");
  if (img) {
    setImage(img);
    renderAllComments();
  }
});
