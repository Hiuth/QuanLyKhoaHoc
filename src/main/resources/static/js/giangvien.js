function fetchAllInstructors() {
    const apiUrl = 'http://localhost:8099/instructor/allInstructor';
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gọi API');
            }
            return response.json();
        })
        .then(data => {
            const instructorList = document.querySelector('.instructors-table tbody');
            instructorList.innerHTML = ''; // Xóa nội dung cũ

            data.forEach(instructor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td id="instructName">${instructor.Name}</td>
                    <td id="instructEmail">${instructor.Email}</td>
                    <td id="instructPhone">${instructor.Phone}</td>
                    <td id="instructExpertise">${instructor.Expertise}</td>
                    <td>
                    <input type="hidden" name="instructorId" id="instructorId" value="${instructor.InstructorID}">
                        <div class="action-buttons">
                            <button class="btn-icon btn-edit" onclick="showModalInstructor('editInstructorModal',event)">✎</button>
                            <button class="btn-icon btn-delete" onclick="deleteInstructor(event)">×</button>
                        </div>
                    </td>
                `;
                instructorList.appendChild(row); // Thêm row vào tbody
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}


function showModalInstructor(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
    }

    // Tìm nút được nhấn và hàng <tr> chứa nút đó
    const button = event.target; // Lấy phần tử nút đã được nhấn
    const row = button.closest('tr'); // Tìm hàng <tr> chứa nút đó

    // Lấy dữ liệu từ các ô td trong hàng
    const name = row.querySelector('#instructName').textContent;
    const email = row.querySelector('#instructEmail').textContent;
    const phone = row.querySelector('#instructPhone').textContent;
    const expertise = row.querySelector('#instructExpertise').textContent;
    const instructorId = row.querySelector('#instructorId').value;


    // Cập nhật các trường trong form chỉnh sửa hoặc modal (ví dụ)
    document.getElementById('instructorName').value = name;
    document.getElementById('instructorEmail').value = email;
    document.getElementById('instructorNumber').value = phone;
    document.getElementById('instructorExpertise').value = expertise;
    document.getElementById('instructorId').value = instructorId;
}
// Hàm xóa giảng viên
function deleteInstructor() {
    const button = event.target; // Lấy phần tử nút đã được nhấn
    const row = button.closest('tr'); // Tìm hàng <tr> chứa nút đó
    const id = row.querySelector('#instructorId').value;
    const apiUrl = `http://localhost:8099/instructor/deleteInstructor/${id}`;
    fetch(apiUrl, {
        method: 'DELETE', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi xóa giảng viên');
            }
            //return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

function addInstructor() {
    const Name = document.getElementById("addInstructorName").value;
    const Email = document.getElementById("addInstructorEmail").value;
    const Phone = document.getElementById("addInstructorPhone").value;
    const Expertise = document.getElementById("addInstructorExpertise").value;
    const update = {
        name: Name,
        email: Email,
        phone: Phone,
        expertise: Expertise,
    }
    const apiUrl = `http://localhost:8099/instructor/createInstructor`;
    fetch(apiUrl, {
        method: 'POST', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update), // Chuyển đổi dữ liệu thành JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật giảng viên');
            }
            //return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(data => {
            //alert("Thêm giảng viên thành công");
            //console.log('Giảng viên đã được cập nhật:', data);
            // Làm gì đó sau khi cập nhật thành công (ví dụ: cập nhật giao diện)
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

function updateInstructor() {
    const id = document.getElementById("instructorId").value;
    const Name = document.getElementById("instructorName").value;
    const Email = document.getElementById("instructorEmail").value;
    const Phone = document.getElementById("instructorNumber").value;
    const Expertise = document.getElementById("instructorExpertise").value;
    const update = {
        name: Name,
        email: Email,
        phone: Phone,
        expertise: Expertise,
    }
   // console.log(update);
    const apiUrl = `http://localhost:8099/instructor/updateInstructor/${id}`;
    fetch(apiUrl, {
        method: 'PUT', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update), // Chuyển đổi dữ liệu thành JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật giảng viên');
            }
            return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(data => {
            //console.log('Giảng viên đã được cập nhật:', data);
            // Làm gì đó sau khi cập nhật thành công (ví dụ: cập nhật giao diện)
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử input và button
    const searchInput = document.getElementById("findInstructor");

    // Kiểm tra xem các phần tử có tồn tại trước khi gán sự kiện
    if (searchInput) {
        // Sự kiện nhấn Enter trên ô input
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault(); // Ngăn form submit nếu có
                const query = searchInput.value;
                findInstructor(query); // Gọi hàm tìm kiếm
            }
        });
    }
});


function findInstructor() {
    const key = document.getElementById("findInstructor").value;
    const apiUrl = `http://localhost:8099/instructor/searchInstructor/${key}`;
    fetch(apiUrl, {
        method: 'GET', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật giảng viên');
            }
            return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(data => {
            const instructorList = document.querySelector('.instructors-table tbody');
            instructorList.innerHTML = ''; // Xóa nội dung cũ

            data.forEach(instructor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td id="instructName">${instructor.Name}</td>
                    <td id="instructEmail">${instructor.Email}</td>
                    <td id="instructPhone">${instructor.Phone}</td>
                    <td id="instructExpertise">${instructor.Expertise}</td>
                    <td>
                    <input type="hidden" name="instructorId" id="instructorId" value="${instructor.InstructorID}">
                        <div class="action-buttons">
                            <button class="btn-icon btn-edit" onclick="showModalInstructor('editInstructorModal',event)">✎</button>
                            <button class="btn-icon btn-delete" onclick="deleteInstructor(event)">×</button>
                        </div>
                    </td>
                `;
                instructorList.appendChild(row); // Thêm row vào tbody
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}





