// Đợi cho DOM load hoàn tất
document.addEventListener("DOMContentLoaded", function () {
  // Khởi tạo tất cả các sự kiện
  initializeEvents();
});

function initializeEvents() {
  // Xử lý tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Xử lý xóa
  initializeDeleteButtons();

  // Xử lý edit
  initializeEditButtons();

  // Xử lý form submit
  initializeFormSubmits();

  // Xử lý các nút thêm mới
  initializeAddButtons();
}

function initializeDeleteButtons() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (confirm("Bạn có chắc chắn muốn xóa?")) {
        const row = this.closest("tr");
        row.remove();
      }
    });
  });
}

// Thêm hàm khởi tạo cho các nút thêm mới
function initializeAddButtons() {
  // Xử lý tất cả các nút có thuộc tính data-modal
  document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal");
      showModal(modalId);
    });
  });
}
function initializeEditButtons() {
  document.querySelectorAll(".btn-edit").forEach((button) => {
    button.addEventListener("click", function (e) {
      const row = this.closest("tr");
      const parentTab = row.closest(".tab-content");

      if (parentTab.id === "courses") {
        // Lấy dữ liệu từ row để điền vào form
        const courseName = row.querySelector("td:nth-child(1)").textContent;
        const description = row.querySelector("td:nth-child(2)").textContent;
        const startDate = row.querySelector("td:nth-child(3)").textContent;
        const endDate = row.querySelector("td:nth-child(4)").textContent;
        const instructor = row.querySelector("td:nth-child(5)").textContent;

        // Điền dữ liệu vào form
        const form = document.getElementById("editCourseForm");
        form.querySelector('[name="courseName"]').value = courseName;
        form.querySelector('[name="description"]').value = description;
        // Chuyển đổi định dạng ngày từ dd/mm/yyyy sang yyyy-mm-dd cho input date
        const formatDate = (dateStr) => {
          const [day, month, year] = dateStr.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        };
        form.querySelector('[name="startDate"]').value = formatDate(startDate);
        form.querySelector('[name="endDate"]').value = formatDate(endDate);

        showModal("editCourseModal");
      } else if (parentTab.id === "students") {
        showModal("editStudentModal");
      } else if (parentTab.id === "instructors") {
        showModal("editInstructorModal");
      }
    });
  });
}

function initializeFormSubmits() {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Tạo object chứa dữ liệu form
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Log dữ liệu form để kiểm tra
      console.log("Form Data:", data);

      // Hiển thị thông báo thành công
      alert("Đã lưu thành công!");

      // Đóng modal nếu form nằm trong modal
      const modal = this.closest(".modal");
      if (modal) {
        hideModal(modal.id);
      }

      // Reset form
      this.reset();
    });
  });
}

function switchTab(tabId) {
  // Ẩn tất cả các tab content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Bỏ active khỏi tất cả các tab
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Hiển thị tab content được chọn
  document.getElementById(tabId).classList.add("active");

  // Active tab được chọn
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Đóng modal khi click bên ngoài
window.addEventListener("click", function (e) {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (e.target === modal) {
      hideModal(modal.id);
    }
  });
});
