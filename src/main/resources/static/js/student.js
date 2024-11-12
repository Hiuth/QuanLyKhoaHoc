function fetchAllStudent() {
    const apiUrl = 'http://localhost:8099/student/allStudents';
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
            const studentList = document.querySelector('.students-table tbody');
            studentList.innerHTML = ''; // Xóa nội dung cũ

            data.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td id="studentName">${student.Name}</td>
                    <td id="studentEmail">${student.Email}</td>
                    <td id="studentPhone">${student.Phone}</td>
                    <td id="studentAddress">${student.Address}</td>
                    <td>
                    <input type="hidden" name="studentId" id="studentId" value="${student.StudentID}">
                        <div class="action-buttons">
                            <button class="btn-icon btn-edit" onclick="showModalStudent('editStudentModal',event)">✎</button>
                            <button class="btn-icon btn-delete" onclick="deleteStudent(event)">×</button>
                        </div>
                    </td>
                `;
                studentList.appendChild(row); // Thêm row vào tbody
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}


function showModalStudent(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
    }

    // Tìm nút được nhấn và hàng <tr> chứa nút đó
    const button = event.target; // Lấy phần tử nút đã được nhấn
    const row = button.closest('tr'); // Tìm hàng <tr> chứa nút đó

    // Lấy dữ liệu từ các ô td trong hàng
    const name = row.querySelector('#studentName').textContent;
    const email = row.querySelector('#studentEmail').textContent;
    const phone = row.querySelector('#studentPhone').textContent;
    const address = row.querySelector('#studentAddress').textContent;
    const studentId = row.querySelector('#studentId').value;

    console.log(name,email,phone,address,studentId);
    // Cập nhật các trường trong form chỉnh sửa hoặc modal (ví dụ)
    document.getElementById('updateStudentName').value = name;
    document.getElementById('updateStudentEmail').value = email;
    document.getElementById('updateStudentPhone').value = phone;
    document.getElementById('updateStudentAddress').value = address;
   document.getElementById('updateStudentId').value = studentId;
}
// Hàm xóa giảng viên
function deleteStudent() {
    // Hiển thị hộp thoại xác nhận
    const confirmDelete = confirm("Bạn có chắc là bạn muốn xóa học viên này không?");
    if (!confirmDelete) {
        return; // Nếu chọn "Cancel", kết thúc hàm và không thực hiện lệnh xóa
    }

    // Nếu chọn "OK", thực hiện lệnh xóa
    const button = event.target; // Lấy phần tử nút đã được nhấn
    const row = button.closest('tr'); // Tìm hàng <tr> chứa nút đó
    const id = row.querySelector('#studentId').value;
    const apiUrl = `http://localhost:8099/student/deleteStudent/${id}`;

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi xóa sinh viên');
            }
            // Xóa hàng khỏi bảng nếu xóa thành công
            row.remove();
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}


function addStudent() {
    const Name = document.getElementById("addStudentName").value;
    const Email = document.getElementById("addStudentEmail").value;
    const Phone = document.getElementById("addStudentPhone").value;
    const Address = document.getElementById("addStudentAddress").value;
    const update = {
        name: Name,
        email: Email,
        phone: Phone,
        address: Address,
    }
    //console.log(update);
    const apiUrl = `http://localhost:8099/student/createStudent`;
    fetch(apiUrl, {
        method: 'POST', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update), // Chuyển đổi dữ liệu thành JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật sinh viên');
            }
            return response.json(); // Chuyển đổi phản hồi sang JSON
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

function updateStudent() {
    const id = document.getElementById('studentId').value;
    const Name = document.getElementById('updateStudentName').value;
    const Email = document.getElementById('updateStudentEmail').value;
    const Phone = document.getElementById('updateStudentPhone').value;
    const Address = document.getElementById('updateStudentAddress').value;
    const update = {
        name: Name,
        email: Email,
        phone: Phone,
        address: Address,
    }
    console.log(update);
    const apiUrl = `http://localhost:8099/student/updateStudent/${id}`;
    fetch(apiUrl, {
        method: 'PUT', // Sử dụng PUT để cập nhật
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update), // Chuyển đổi dữ liệu thành JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật sinh viên');
            }
            return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(data => {
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử input và button
    const searchInput = document.getElementById("findStudent");

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
    const key = document.getElementById("findStudent").value;
    const apiUrl = `http://localhost:8099/student/findStudents/${key}`;
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
            const studentList = document.querySelector('.students-table tbody');
            studentList.innerHTML = ''; // Xóa nội dung cũ

            data.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td id="studentName">${student.Name}</td>
                    <td id="studentEmail">${student.Email}</td>
                    <td id="studentPhone">${student.Phone}</td>
                    <td id="studentAddress">${student.Address}</td>
                    <td>
                    <input type="hidden" name="studentId" id="studentId" value="${student.StudentID}">
                        <div class="action-buttons">
                            <button class="btn-icon btn-edit" onclick="showModalStudent('editStudentModal',event)">✎</button>
                            <button class="btn-icon btn-delete" onclick="deleteStudent(event)">×</button>
                        </div>
                    </td>
                `;
                studentList.appendChild(row); // Thêm row vào tbody
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}




