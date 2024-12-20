function addUserIds() {
  const data = document.querySelectorAll("video[data-sid]");

  data.forEach((datum) => {
    datum.parentElement.dataset.userid = datum.dataset.sid;
  });
}

addUserIds();
