export function maxPagination(totalPages, currentPage) {
  const pages = [];
  let start, end;

  try {
    if (totalPages <= 5) {
      start = 0;
      end = totalPages - 1;
    } else if (currentPage <= 2) {
      start = 0;
      end = 4;
    } else if (currentPage >= totalPages - 3) {
      start = totalPages - 5;
      end = totalPages - 1;
    } else {
      start = currentPage - 2;
      end = currentPage + 2;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage >= 4 && !pages.includes(0)) {
      pages.unshift(0);
    }

    if (end <= totalPages - 2) {
      pages.push("...");
      pages.push(totalPages - 1);
    } else if (end === totalPages - 2) {
      pages.push(totalPages - 1);
    }

    return pages;
  } catch (error) {
    console.log(`Ошибка в параметрах пагинации: ${error}`);
  }
}

export function renderPagination(totalPages, currentPage, onPageClick) {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  const pages = maxPagination(totalPages, currentPage);

  try {
    pages.forEach(page => {
      if (page === "...") {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.classList.add("pagination__dots");
        pagination.appendChild(dots);
      } else {
        const btn = document.createElement("button");
        btn.textContent = page + 1;
        btn.classList.add("pagination__btn");
        if (page === currentPage) {
          btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
          onPageClick(page);
        });

        pagination.appendChild(btn);
      }
    });
  } catch (error) {
    console.log(`Ошибка в рендере пагинации: ${error}`);
  }
}