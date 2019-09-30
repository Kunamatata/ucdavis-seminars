const seminarContainer = document.querySelector(".seminars");
const seminars = document.querySelectorAll(".seminar");
const seminarTitles = document.querySelectorAll(".seminar-title");
const searchInput = document.querySelector(".search-input");

searchInput.oninput = e => {
  const filteredSeminars = Array.from(seminarTitles).filter(seminarTitle => {
    const { title, description } = seminarTitle.dataset;
    return (
      !title.toLowerCase().includes(e.target.value.toLowerCase()) &&
      !description.toLowerCase().includes(e.target.value.toLowerCase())
    );
  });

  filteredSeminars.forEach(el => {
    el.parentElement.remove();
  });

  if (e.target.value.length === 0) {
    Array.from(seminars).forEach(el => {
      seminarContainer.append(el);
    });
  }
};
